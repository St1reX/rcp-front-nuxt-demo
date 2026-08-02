<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui/.';
import { format } from 'date-fns';
import { pl } from '@nuxt/ui/locale';
import { FetchError } from 'ofetch';
import { RequestForLeaveSchema, type RequestForLeaveRequest } from '~/types/schemas/leave';
import { today } from '@internationalized/date';
import { LeaveTypes, LeaveTypesValues } from '~/constants/leaveTypes';

//******HOOKS*********
const api = useApi();
const session = useSessionStore();
const toast = useToast();

//******VARIABLES/STATES*********
const isSent = ref<boolean>(false);
const employees = ref<{ id: string; label: string }[]>([]);
const currentDateFormatted = today('Europe/Warsaw');
const state = reactive<RequestForLeaveRequest>({
    employeeId: '',
    startDate: '',
    endDate: '',
    type: LeaveTypes.VACATION,
    reason: undefined,
});
const selectedDates = shallowRef({
    start: undefined,
    end: undefined,
});

//******FUNCTIONS*********
const fetchDepartmentEmployees = async () => {
    if (!session.session?.department) {
        toast.add({
            title: 'Konto na którym jesteś zalogowany nie jest przypisane do żadnego działu!',
            description: 'Będzie ono nieaktywne dopóki nie zostanie przypisane do oddziału firmy!',
            color: 'error',
            duration: 15000,
        });
    } else {
        try {
            const data = await api.employee.getByDepartment({
                departmentId: session.session.department.id,
            });

            if (data.employees) {
                data.employees.map((element) => {
                    const employee = {
                        id: element.id,
                        label: `${element.firstName} ${element.lastName}`,
                    };

                    employees.value.push(employee);
                });
            } else {
                toast.add({
                    title: 'Wystąpił błąd',
                    description: `Brak pracowników przypisanych do działu obecnie zalogowanego użytkownika`,
                    color: 'error',
                    duration: 5000,
                });
            }
        } catch (e: any) {
            useFetchErrorHandler('Pracownicy', e);
        }
    }
};
const onSubmit = async (event: FormSubmitEvent<RequestForLeaveRequest>) => {
    event?.preventDefault();

    try {
        if (!selectedDates.value.start || !selectedDates.value.end) {
            toast.add({
                title: 'Wymagane daty',
                description: 'Wybierz początkową i końcową datę urlopu',
                color: 'error',
                duration: 5000,
            });
            return;
        }

        state.startDate = format(selectedDates.value.start as Date, 'yyyy-MM-dd');
        state.endDate = format(selectedDates.value.end as Date, 'yyyy-MM-dd');

        const parsed = RequestForLeaveSchema.safeParse(state);
        if (!parsed.success) {
            toast.add({
                title: 'Podano nieprawidłowe dane',
                description: 'Upewnij się że uzupełniłeś wszystkie pola prawidłowo',
                color: 'error',
                duration: 5000,
            });
            return;
        }

        isSent.value = true;
        await api.leave.request({
            employeeId: event.data.employeeId,
            startDate: state.startDate,
            endDate: state.endDate,
            type: state.type,
            reason: state.reason,
        });

        state.employeeId = '';
        state.endDate = '';
        state.startDate = '';

        selectedDates.value.end = undefined;
        selectedDates.value.start = undefined;

        toast.add({
            title: 'Wniosek o urlop wysłany',
            description: 'Zgłoszenie urlopu zostało wysłane prawidłowo',
            color: 'success',
            duration: 3500,
        });

        setTimeout(() => {
            window.location.reload();
        }, 3500);
    } catch (e: any) {
        isSent.value = false;

        if (e instanceof FetchError) {
            if (e.statusCode === 403) {
                toast.add({
                    title: 'Błąd podczas wysyłania wniosku o urlop',
                    description:
                        'Wybrany użytkownik nie ma przypisanego żadnego ETATU nie można utworzyć dla niego wniosku o urlop.',
                    color: 'error',
                    duration: 10000,
                });

                return;
            } else if (e.statusCode === 409) {
                toast.add({
                    title: 'Błąd podczas wysyłania wniosku o urlop',
                    description:
                        'Użytkownik posiada inny, aktywny wniosek o urlop, który koliduje z podanymi datami',
                    color: 'error',
                    duration: 10000,
                });
                return;
            }
        }
        useFetchErrorHandler('Urlop', e);
    }
};
onMounted(async () => {
    await fetchDepartmentEmployees();
});
</script>

<template>
    <UForm @submit="onSubmit" :state="state" class="flex flex-col w-full gap-4 md:w-1/2">
        <UFormField label="Data urlopu">
            <UCalendar
                v-model="selectedDates"
                class="p-2"
                :min-value="currentDateFormatted"
                :week-starts-on="0"
                :number-of-months="1"
                range
            />
        </UFormField>
        <UFormField label="Pracownik" name="employeeId">
            <USelect v-model="state.employeeId" :items="employees" value-key="id" class="w-full" />
        </UFormField>
        <UFormField label="Typ" name="type">
            <USelect
                v-model="state.type"
                value-key="value"
                :items="LeaveTypesValues"
                class="w-full"
            />
        </UFormField>
        <UFormField v-if="state.type === LeaveTypes.BEREAVEMENT" label="Powód" name="reason">
            <UTextarea v-model="state.reason" class="w-full" placeholder="Podaj powód urlopu" />
        </UFormField>

        <div class="pt-2">
            <UButton :disabled="isSent" type="submit" block> Wyślij zgłoszenie </UButton>
        </div>
    </UForm>
</template>
