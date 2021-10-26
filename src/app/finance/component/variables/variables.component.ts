import { Component, OnInit } from "@angular/core";
import { RegistryService } from "../../../core/services/registry";
import { LoadingService } from "../../../core/services/loading.service";
import { Subscription } from "rxjs";
import {Location} from '@angular/common';

@Component({
  selector: "app-variables",
  templateUrl: "./variables.component.html",
  styleUrls: ["./variables.component.css"]
})
export class VariablesComponent implements OnInit {
  variables: any[] = [];
  viewHeight: string = "600px";
  cols: any[] = [];
  constructor(
    private registryService: RegistryService,
    private loadingService: LoadingService,
    private _location: Location
  ) {}

  ngOnInit() {
    this.getVariables();
  }

  getVariables(): Subscription {
    this.loadingService.show();
    return this.registryService.getVariables().subscribe(
      data => {
        this.loadingService.hide();
        this.variables = data.result;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  back() {
    this._location.back()
  }
}
