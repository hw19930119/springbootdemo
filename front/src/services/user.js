import request from '../utils/request';

import { user as api } from './api';

export function getUserList() {
    return request(api.getUserList, true);
}
