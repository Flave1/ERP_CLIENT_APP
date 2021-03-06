import {Component} from '@angular/core';
import {Message} from 'primeng/api';
import {BreadcrumbService} from '../../shared/common/breadcrumb.service';

@Component({
    templateUrl: './filedemo.component.html'
})
export class FileDemoComponent {

    msgs: Message[];

    uploadedFiles: any[] = [];

    constructor(private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Components' },
            { label: 'File Upload', routerLink: ['/file'] }
        ]);
    }

    onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.msgs = [];
        this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
}
