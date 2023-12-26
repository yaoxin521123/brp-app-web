import request from "@/utils/request";
import type {
  HospitalDetailData,
  DeparmentResponseData,
  UserLoginResponseData,
  LoginData,
  UWXLoginResponseData,
  HospitalWorkData,
  DoctorResponseData,
  UserResponseData,
  DoctorInfoData,
} from "./type";
enum API {
  HOSPITALDETAIL_URL = "/hosp/hospital/",
  HOSPITALDEPARMENT_URL = "/hosp/hospital/department/",
  GETUSERCODE_URL = "/sms/send/",
  USERLOGIN_URL = "/user/login",
  WXLOGIN_URL = "/user/weixin/getLoginParam/",
  HOSPITALWORK_URL = "/hosp/hospital/auth/getBookingScheduleRule/",
  HOSPITALDOCTOR_URL = "/hosp/hospital/auth/findScheduleList/",
  GETUSER_URL = "/user/patient/auth/findAll",
  GETDOCTOR_URL = "/hosp/hospital/getSchedule/",
}

export const reqHospitalDetail = (hoscode: string) =>
  request.get<any, HospitalDetailData>(API.HOSPITALDETAIL_URL + hoscode);

export const reqHospitalDeparment = (hoscode: string) =>
  request.get<any, DeparmentResponseData>(API.HOSPITALDEPARMENT_URL + hoscode);

export const reqCode = (phone: string) =>
  request.get<any, any>(API.GETUSERCODE_URL + phone);

export const reqUserLogin = (data: LoginData) =>
  request.post<any, UserLoginResponseData>(API.USERLOGIN_URL, data);

export const reqWxLogin = (wxRedirectUri: string) =>
  request.get<any, UWXLoginResponseData>(
    API.WXLOGIN_URL + `?wxRedirectUri=${wxRedirectUri}`
  );

export const reqHospitalWork = (
  page: number,
  limit: number,
  hoscode: string,
  depcode: string
) =>
  request.get<any, HospitalWorkData>(
    API.HOSPITALWORK_URL + `${page}/${limit}/${hoscode}/${depcode}`
  );
export const reqHospitalDoctor = (
  hoscode: string,
  depcode: string,
  workDate: string
) =>
  request.get<any, DoctorResponseData>(
    API.HOSPITALDOCTOR_URL + `${hoscode}/${depcode}/${workDate}`
  );
export const reqGetUser = () =>
  request.get<any, UserResponseData>(API.GETUSER_URL);
export const reqDoctorInfo = (scheduleId: string) =>
  request.get<any, DoctorInfoData>(API.GETDOCTOR_URL + `${scheduleId}`);
