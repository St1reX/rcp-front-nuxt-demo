import BaseApi from '../common/BaseApi';
import type {
  AssignCardResponse,
  GetEmployeeCardsResponse,
  DeleteCardResponse,
  GetAllCardsResponse,
  GetCardByIdResponse,
} from '../../types/models/card';
import type {
  AssignCardRequest,
  GetEmployeeCardsRequest,
  DeleteCardRequest,
  GetCardByIdRequest,
  GetAllCardsRequest,
} from '../../types/schemas/card';

export default class CardApi extends BaseApi {
  getAllCards(data: GetAllCardsRequest) {
    return this._restClient.clientSideFetch<GetAllCardsResponse>('', {
      method: 'GET',
      credentials: 'include',
      query: {
        limit: data.limit,
        offset: data.offset,
        orderBy: data.orderBy,
        sort: data.sort,
      },
    });
  }

  getCardById(data: GetCardByIdRequest) {
    return this._restClient.clientSideFetch<GetCardByIdResponse>(`${data.cardId}`, {
      method: 'GET',
      credentials: 'include',
    });
  }

  assignCardToEmployee(data: AssignCardRequest) {
    return this._restClient.clientSideFetch<AssignCardResponse>('assign', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  getEmployeeCards(data: GetEmployeeCardsRequest) {
    return this._restClient.clientSideFetch<GetEmployeeCardsResponse>(
      `employee/${data.employeeId}`,
      {
        method: 'GET',
        credentials: 'include',
        query: {
          limit: data.limit,
          offset: data.offset,
          orderBy: data.orderBy,
          sort: data.sort,
        },
      }
    );
  }

  deleteCard(data: DeleteCardRequest) {
    return this._restClient.clientSideFetch<DeleteCardResponse>(`${data.cardId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }
}
