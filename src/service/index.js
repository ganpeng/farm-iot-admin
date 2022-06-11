import * as farm from './farm';
import * as device_manage from './routes/device_manage';
import * as model_manage from './routes/model_manage';
import * as warning_manage from './routes/warning_manage';
import * as statistics_manage from './routes/statistics_manage';
import * as user_manage from './routes/user_manage';
import * as role_manage from './routes/role_manage';
import * as login_manage from './routes/login_manage';
import * as version_manage from './routes/version_manage';
import * as app_version_manage from './routes/app_version_manage';

export default Object.assign(
  {},
  farm,
  device_manage,
  model_manage,
  warning_manage,
  statistics_manage,
  user_manage,
  role_manage,
  login_manage,
  version_manage,
  app_version_manage
);
