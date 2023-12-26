import { defineStore } from "pinia";
import { reqHospitalDetail, reqHospitalDeparment } from "@/api/hospital";
import type {
  HospitalDetailData,
  HospitalDetail,
  DeparmentResponseData,
} from "@/api/hospital/type";
import { DetailState } from "@/store/modules/interface";
const useDetailStore = defineStore("Detail", {
  state: (): DetailState => {
    return {
      hospitalInfo: {} as HospitalDetail,
      deparmentArr: [],
    };
  },
  actions: {
    async getHospital(hoscode: string) {
      let result: HospitalDetailData = await reqHospitalDetail(hoscode);
      if (result.code == 200) {
        this.hospitalInfo = result.data;
      }
    },
    async getDeparment(hoscode: string) {
      let result: DeparmentResponseData = await reqHospitalDeparment(hoscode);
      if (result.code == 200) {
        this.deparmentArr = result.data;
      }
    },
  },
  getters: {},
});

export default useDetailStore;
