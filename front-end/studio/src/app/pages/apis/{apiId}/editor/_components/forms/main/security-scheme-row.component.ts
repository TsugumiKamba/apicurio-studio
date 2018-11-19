/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from "@angular/core";
import {OasDocument, OasSecurityScheme, OasTag} from "oai-ts-core";
import {createChangePropertyCommand, ICommand} from "oai-ts-commands";
import {CommandService} from "../../../_services/command.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {KeypressUtils} from "../../../_util/object.util";


@Component({
    moduleId: module.id,
    selector: "security-scheme-row",
    templateUrl: "security-scheme-row.component.html",
    styleUrls: ["security-scheme-row.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuritySchemeRowComponent extends AbstractBaseComponent {

    @Input() document: OasDocument;
    @Input() scheme: OasSecurityScheme;

    @Output() onEdit: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onRename: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected _editing: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService) {
        super(changeDetectorRef, documentService);
    }

    public name(): string {
        if (this.scheme.schemeName()) {
            return this.scheme.schemeName();
        } else {
            return "No name.";
        }
    }

    public hasName(): boolean {
        return this.scheme.schemeName() ? true : false;
    }

    public schemeType(): string {
        if (this.scheme.type) {
            return this.scheme.type;
        } else {
            return "No Type";
        }
    }

    public description(): string {
        return this.scheme.description
    }

    public hasDescription(): boolean {
        return this.scheme.description ? true : false;
    }

    public isEditing(): boolean {
        return this._editing;
    }

    public toggle(): void {
        this._editing = !this._editing;
    }

    public edit(): void {
        this._editing = true;
    }

    public ok(): void {
        this._editing = false;
    }

    public cancel(): void {
        this._editing = false;
    }

    public delete(): void {
        this.onDelete.emit(true);
    }

    public editScheme(): void {
        this.onEdit.emit(true);
    }

    public renameScheme(): void {
        this.onRename.emit(true);
    }

    public isValid(): boolean {
        return true;
    }

    public setDescription(description: string): void {
        let command: ICommand = createChangePropertyCommand<string>(this.document, this.scheme, "description", description);
        this.commandService.emit(command);
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.cancel();
        }
    }

}
