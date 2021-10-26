import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class WorkflowService {
  constructor(private apiService: ApiService) {}
  userData: any = {};

  //============================Workflow Group===================================
  getAllWorkflowGroup() {
    return this.apiService.get("/workflow/get/all/workflowgroups").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getSingleWorkflowGroup(workflowGroupId) {
    return this.apiService
      .get(
        `/workflow/get/single/workflowgroup/workflowgroupId?WorkflowGroupId=${workflowGroupId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getWorkflowOperationTypes() {
    return this.apiService.get(`/workflow/get/all/operationTypes`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getWorkflowOperation() {
    return this.apiService.get(`/workflow/get/all/operations`).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getWorkflowGroupByAccess(accessId) {
    return this.apiService
      .get(`/workflow/workflow-group-by-access?accessId=${accessId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteWorkflowGroup(workflowGroupId) {
    return this.apiService
      .delete(
        `/workflow/delete-workflow-group?workflowGroupId=${workflowGroupId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateWorkflowGroup(body): Observable<any> {
    return this.apiService
      .post(`/workflow/add/updadte/workflowgroup`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportWorkflowGroup() {
    return this.apiService
      .getExcel("/workflow/generate/excel/workflowgroup")
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadWorkflowGroup(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/workflow/upload/workflowgroups", imageFile)
      .then(data => {
        return data;
      });
  }
  deleteMultipleWorkflowGroup(body) {
    return this.apiService
      .post(`/workflow/delete/workflowgroups/targetIds`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  //============================Workflow Level===================================
  getAllWorkflowLevel() {
    return this.apiService.get("/workflow/get/workflowlevels").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getSingleWorkflowLevel(workflowLevelId) {
    return this.apiService
      .get(
        `/workflow/get/single/workflowlevelId?WorkflowLevelId=${workflowLevelId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getWorkflowLevelByGroup(workflowGroupId) {
    return this.apiService
      .get(
        `/workflow/workflow-level-by-group?workflowGroupId=${workflowGroupId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteWorkflowLevel(workflowLevelId) {
    return this.apiService
      .delete(
        `/workflow/delete-workflow-level?workflowLevelId=${workflowLevelId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateWorkflowLevel(body): Observable<any> {
    return this.apiService
      .post(`/workflow/add/update/workflowLevel`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportWorkflowLevel() {
    return this.apiService
      .getExcel(`/workflow/generate/excel/workflowlevel`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadWorkflowLevel(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/workflow/upload/workflowLevel", imageFile)
      .then(data => {
        return data;
      });
  }
  deleteMultipleWorkflowLevel(body) {
    return this.apiService
      .post(`/workflow/delete/workflowLevel/targetIds`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  //============================Workflow Staff===================================
  getAllWorkflowLevelStaff() {
    return this.apiService.get("/workflow/get/all/workflowLevelStaff").pipe(
      tap(data => {
        return data;
      })
    );
  }

  getSingleWorkflowLevelStaff(workflowLevelStaffId) {
    return this.apiService
      .get(
        `/workflow/get/single/workflowLevelStaff/workflowLevelStaffId?WorkflowLevelStaffId=${workflowLevelStaffId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getWorkflowLevelStaffByLevel(workflowLevelId) {
    return this.apiService
      .get(
        `/workflow/workflow-levelstaff-by-level?workflowLevelId=${workflowLevelId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getWorkflowLevelStaffByStaff(staffId) {
    return this.apiService
      .get(`/workflow/workflow-levelstaff-by-staff?staffId=${staffId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteWorkflowLevelStaff(workflowLevelStaffId) {
    return this.apiService
      .delete(
        `/workflow/delete-workflow-level-staff?workflowLevelStaffId=${workflowLevelStaffId}`
      )
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateWorkflowLevelStaff(body): Observable<any> {
    return this.apiService
      .post(`/workflow/add/update/workflowLevelStaff`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  exportWorkflowLevelStaff() {
    return this.apiService
      .getExcel("/workflow/download/workflowlevelstaff")
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  uploadWorkflowLevelStaff(imageFile: File): Promise<any> {
    return this.apiService
      .uploadExcel("/workflow/upload/workflowlevelstaff", imageFile)
      .then(data => {
        return data;
      });
  }
  deleteMultipleWorkflowLevelStaff(body) {
    return this.apiService
      .post(`/workflow/delete/workflowLevelStaff/targetIds`, body)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  //============================Workflow===================================

  getSingleWorkflow(workflowId) {
    return this.apiService
      .get(`/workflow/get/single/workflow/workflowId?WorkflowId=${workflowId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  getWorkflowByOperation(operationId) {
    return this.apiService
      .get(`/workflow/get/all/workflow/operationId?OperationId=${operationId}`)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  deleteWorkflow(workflowIds) {
    return this.apiService
      .post(`/workflow/delete/workflowIds`, workflowIds)
      .pipe(
        tap(data => {
          return data;
        })
      );
  }

  addUpdateWorkflow(body): Observable<any> {
    return this.apiService.post(`/workflow/add/update/workflow`, body).pipe(
      tap(data => {
        return data;
      })
    );
  }

  getAllWorkflowOperation() {
    return this.apiService.get("/workflow/get/all/operations").pipe(
      tap(data => {
        return data;
      })
    );
  }
  updateWorkflowOperation(wkflowOperations): Observable<any> {
    return this.apiService
      .post(`/workflow/update/all/workflowOperation`, { wkflowOperations })
      .pipe(
        tap(data => {
          return data;
        })
      );
  }
}
