import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class IfrsService {
  constructor(private apiService: ApiService) {}
  userData: any = {};

  getAllIFRSScenarioSetupData() {
    return this.apiService.get("/ifrs/get/all/scenario/setup").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllIFRSSetupData() {
    return this.apiService.get("/ifrs/get/all/setup/data").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getIFRSSetupData(setupId) {
    return this.apiService
      .get(`/ifrs/get/single/setup/data?SetUpId=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getIFRSScenarioSetupData(setupId) {
    return this.apiService
      .get(`/ifrs/get/single/scenario/setup?ScenarioId=   ${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteIFRSSetupData(setupId) {
    return this.apiService.delete(`/ifrs/setup-data?setupId=${setupId}`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  deleteIFRSScenarioSetupData(setupId) {
    return this.apiService
      .delete(`/ifrs/delete-IfrsScenarioSetup?Id=${setupId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateIFRSSetupData(body): Observable<any> {
    return this.apiService.post(`/ifrs/add/update/setup/data`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  updateIFRSScenarioSetupData(body): Observable<any> {
    return this.apiService.post(`/ifrs/add/update/scenario/setup`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllMacroEconomicVariable() {
    return this.apiService.get("/ifrs/get/all/macro/economic/variable").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getMacroEconomicVariable(macroEconomicVariableId) {
    return this.apiService
      .get(
        `/ifrs/get/single/macro/economic/variable?MacroEconomicVariableId=${macroEconomicVariableId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteMacroEconomicVariable(macroEconomicVariableId) {
    return this.apiService
      .delete(
        `/ifrs/macro-economic-variable?macroEconomicVariableId=${macroEconomicVariableId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  updateMacroEconomicVariable(body): Observable<any> {
    return this.apiService
      .post(`/ifrs/add/update/macro/economic/variable`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportMacroEconomicVariable() {
    return this.apiService
      .getExcel("/ifrs/download/macro/economic/variable")
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  multiDeleteMacroEconomicVariable(ids: any): Observable<any> {
    return this.apiService
      .post(`/ifrs/delete/macro/economic/variable`, ids)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadMacroEconomicVariable(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/ifrs/upload/macro/economic/variable", imageFile)
      .then(data => {
        return data;
      });
  }

  getAllScoreCardHistory() {
    return this.apiService.get("/ifrs/get/all/score/card/history").pipe(
      tap(data => {
        return data;
      })
    );
  }

  deleteScoreCardHistory(applicationScoreCardId) {
    return this.apiService
      .delete(
        `/ifrs/score-card-history?applicationScoreCardId=${applicationScoreCardId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportScoreCardHistory() {
    return this.apiService.getExcel("/ifrs/score-card-history/export").pipe(
      tap(data => {
        return data;
      })
    );
  }

  exportHistoricalPD(productId, customerTypeId) {
    return this.apiService
      .getExcel(
        `/ifrs/download/historical/pd?ProductId=${productId}&CustomerTypeId=${customerTypeId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadScoreCardHistory(imageFile: File):Promise<any> {
    return this.apiService
      .uploadExcel("/ifrs/upload/score/card/history", imageFile)
      .then(data => {
        return data;
      });
  }

  uploadScoreCardHistoryIR(imageFile: File):Promise<any> {
    return this.apiService
      .uploadExcel("/ifrs/upload/score/card/initial", imageFile)
      .then(data => {
        return data;
      });
  }

  getAllLGDHistory() {
    return this.apiService.get("/ifrs/get/all/lgd/history").pipe(
      tap(data => {
        return data;
      })
    );
  }

  deleteLGDHistory(historicalLGDId) {
    return this.apiService
      .delete(`/ifrs/lgd-history?historicalLGDId=${historicalLGDId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportLGDHistory() {
    return this.apiService.getExcel("/ifrs/download/lgd/history").pipe(
      tap(data => {
        return data;
      })
    );
  }

  uploadLGDHistory(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/ifrs/upload/lgd/history", imageFile)
      .then(data => {
        return data;
      });
  }
  
  multiDeleteLgdHistory(payload: Object): Observable<any> {
    return this.apiService
      .post(`/ifrs/delete/lgd/history`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
  multipleDeletePdHistory(payload: Object): Observable<any> {
    return this.apiService
      .post(`/ifrs/delete/score/card/history`, payload)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
}
