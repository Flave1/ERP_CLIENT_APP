import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { IfrsService } from "src/app/core/services/ifrs.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";
@Component({
    selector: "app-macro-economic-variable",
    templateUrl: "./macro-economic-variable.component.html"
})
export class MacroEconomicVariableComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add Macro Economic Variable";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private ifrsService: IfrsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            year: [""],
            unemployement: [""],
            erosion: [""],
            foregnEx: [""],
            gdp: [""],
            inflation: [""],
            otherfactor: [""],
            others: [""]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let macroEconomicVariableId = params["editmacroeconomicvariable"];
            if (
                macroEconomicVariableId != null ||
                macroEconomicVariableId != undefined
            ) {
                this.editMacroEconomicVariable(macroEconomicVariableId);
            }
        });
    }

    editMacroEconomicVariable(macroEconomicVariableId) {
        this.formTitle = "Edit Macro Economic Variable";
        this.loadingService.show();
        this.ifrsService
            .getMacroEconomicVariable(macroEconomicVariableId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data.macroVariables[0];
                this.form = this.fb.group({
                    year: [row.year],
                    unemployement: [row.unemployement],
                    erosion: [row.erosion],
                    foregnEx: [row.foregnEx],
                    gdp: [row.gdp],
                    inflation: [row.inflation],
                    otherfactor: [row.otherfactor],
                    others: [row.others]
                });
            }, err => {
              this.loadingService.hide()
            });
    }

    goBack() {
        this.router.navigate(["/credit/macro-economic-variable-list"]);
    }
    submitMacroEconomicVariable(formObj) {
      const payload = formObj.value;
      payload.year = parseInt(payload.year);
      payload.gdp = parseFloat(payload.gdp);
      payload.unemployement = parseFloat(payload.unemployement);
      payload.inflation = parseFloat(payload.inflation);
      payload.erosion = parseFloat(payload.erosion);
      payload.foregnEx = parseInt(payload.foregnEx);
      payload.others = parseFloat(payload.others);
      payload.otherfactor = parseFloat(payload.otherfactor)
        this.loadingService.show();
        this.ifrsService.updateMacroEconomicVariable(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate([
                        "/credit/macro-economic-variable-list"
                    ]);
                } else {
                    swal.fire("GOS FINANCIAL", message, "error");
                }
            },
            err => {
                this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
            }
        );
    }
}
