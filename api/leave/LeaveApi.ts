import BaseApi from "../common/BaseApi";
import type {
  RequestForLeaveResponse,
  ApproveLeaveResponse,
  DisapproveLeaveResponse,
  GetLeaveByIdResponse,
  GetAllLeavesResponse,
  AddLeaveResponse,
} from "../../types/models/leave";
import type {
  RequestForLeaveRequest,
  DisapproveLeaveRequest,
  ApproveLeaveRequest,
  GetLeaveByIdRequest,
  AddLeaveRequest,
  UpdateLeaveAdminRequest,
  GetAllLeavesForMonthRequest,
} from "../../types/schemas/leave";

export default class LeaveApi extends BaseApi {
  request(data: RequestForLeaveRequest) {
    return this._restClient.clientSideFetch<RequestForLeaveResponse>(
      "/request",
      {
        method: "POST",
        credentials: "include",
        body: data,
      }
    );
  }

  add(data: AddLeaveRequest) {
    return this._restClient.clientSideFetch<AddLeaveResponse>("/", {
      method: "POST",
      credentials: "include",
      body: data,
    });
  }

  getAll() {
    return this._restClient.clientSideFetch<GetAllLeavesResponse>("/", {
      method: "GET",
      credentials: "include",
    });
  }

  getAllForMonth(data: GetAllLeavesForMonthRequest) {
    return this._restClient.clientSideFetch<GetAllLeavesResponse>(
      `/for-month/${data.year}/${data.month}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  }

  getById(data: GetLeaveByIdRequest) {
    return this._restClient.clientSideFetch<GetLeaveByIdResponse>(
      `${data.leaveId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  }

  disapprove(data: DisapproveLeaveRequest) {
    return this._restClient.clientSideFetch<DisapproveLeaveResponse>(
      `${data.leaveId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  }

  approve(data: ApproveLeaveRequest) {
    return this._restClient.clientSideFetch<ApproveLeaveResponse>(
      `${data.leaveId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
  }

  updateAdmin(data: UpdateLeaveAdminRequest) {
    return this._restClient.clientSideFetch<UpdateLeaveAdminRequest>(
      `/admin/${data.leaveId}`,
      {
        method: "PATCH",
        credentials: "include",
        body: data,
      }
    );
  }
}
