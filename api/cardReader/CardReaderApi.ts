import BaseApi from '../common/BaseApi';
import {
  type CreateCardReaderResponse,
  type GetAllCardReadersResponse,
  type DeleteCardReaderResponse,
  type GetCardReaderByIdResponse,
  type RestartCardReaderResponse,
  type UpdateCardReaderResponse,
} from '../../types/models/cardReader';
import type {
  CreateCardReaderRequest,
  DeleteCardReaderRequest,
  GetAllReadersRequest,
  GetCardReaderByIdRequest,
  RestartCardReaderRequest,
  UpdateCardReaderRequest,
} from '../../types/schemas/cardReader';

export default class CardReader extends BaseApi {
  create(data: CreateCardReaderRequest) {
    return this._restClient.clientSideFetch<CreateCardReaderResponse>('create', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  list(data: GetAllReadersRequest) {
    return this._restClient.clientSideFetch<GetAllCardReadersResponse>('list', {
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

  getById(data: GetCardReaderByIdRequest) {
    return this._restClient.clientSideFetch<GetCardReaderByIdResponse>(
      `${data.readerId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  update(data: UpdateCardReaderRequest) {
    return this._restClient.clientSideFetch<UpdateCardReaderResponse>(
      `${data.readerId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        body: data,
      }
    );
  }

  delete(data: DeleteCardReaderRequest) {
    return this._restClient.clientSideFetch<DeleteCardReaderResponse>(
      `${data.readerId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
  }

  restart(data: RestartCardReaderRequest) {
    return this._restClient.clientSideFetch<RestartCardReaderResponse>(
      'restart',
      {
        method: 'POST',
        credentials: 'include',
        body: data,
      }
    );
  }
}
