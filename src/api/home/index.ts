import request from "@/utils/request";
import type {
  HospitalResponseData,
  HospitalLevelAndRegionResponseData,
  HospitalInfoData,
} from "./type";
enum API {
  HOSPITAL_URL = "/hosp/hospital/",
  HOSPITALLEVELANDREGION_URL = "/cmn/dict/findByDictCode/",
  HOSPITALINFO_URL = "/hosp/hospital/findByHosname/",
}
export const reqHospital = (
  page: number,
  limit: number,
  hostype = "",
  districtCode = ""
) =>
  request.get<any, HospitalResponseData>(
    API.HOSPITAL_URL +
      `${page}/${limit}?hostype=${hostype}&districtCode=${districtCode}`
  );
export const reqHospitalLevelAndRegion = (dictCode: string) =>
  request.get<any, HospitalLevelAndRegionResponseData>(
    API.HOSPITALLEVELANDREGION_URL + `${dictCode}`
  );

export const reqHospitalInfo = (hosname: string) =>
  request.get<any, HospitalInfoData>(API.HOSPITALINFO_URL + `${hosname}`);
