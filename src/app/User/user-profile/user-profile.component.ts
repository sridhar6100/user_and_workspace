import { Component,OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/Services/workspace.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { AuthServiceService } from 'src/app/Services/auth-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit
{

  workspaces:any = [];
  selectedWorkspace:any;
  selectedWorkspaceId:any = null;

  selectedIcon:File | undefined;

  selectedFiles: Array<{ name: string; file:File; dataURL: string; type: string }> = [];

  constructor(
    private workspaceService:WorkspaceService,
    private modalService: NgbModal,
    private formValidatorService:FormValidatorService,
    private authService:AuthServiceService,
    ){}

  workspaceForm = new FormGroup({
    title :new FormControl('',Validators.required),
    desc :new FormControl(''),
  });

  ngOnInit(): void 
  {
    this.authService.ValidateUser().subscribe((res:any)=>{
      this.authService.SetUserId(res.userId); 
      this.GetWorkspaces();
    },(error)=>{
    });
  }

  openModal(component:any,size:string="md",workspaceid:any = null)
  {
    const modalRef = this.modalService.open(component,{
      size: size,
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });

    this.workspaceForm.reset();
    this.selectedFiles = [];
    this.selectedIcon = undefined;

    if(workspaceid)
    {
      this.selectedWorkspaceId = workspaceid;
      this.workspaceService.GetWorkspace(workspaceid).subscribe((res:any)=>{
        this.selectedWorkspace = res;
      },(error:any)=>{
        console.log(error);
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedIcon = event.target.files[0];
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFiles.push({ name: file.name,file:file, dataURL: e.target.result, type: file.type });
      };

      reader.readAsDataURL(file);
    }
  }

  GetWorkspaces()
  {
    this.workspaceService.GetWorkspaces(`userId=${this.authService.GetUserId()}`).subscribe((res:any)=>{
      this.workspaces = res;      
    },(error)=>{
      console.log(error);
    });   
  }

  OnCreateSubmit()
  {
    if(this.workspaceForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.workspaceForm);
      return;
    }
    const formData = new FormData();
    formData.append("title",this.workspaceForm.value.title??'');
    formData.append("desc",this.workspaceForm.value.desc??'');
    formData.append("userId",this.authService.GetUserId()??null);
    if (this.selectedIcon) {
      formData.append('icon', this.selectedIcon, this.selectedIcon.name);
    }
    for (const file of this.selectedFiles) {
      
      formData.append("attachments",file.file);
    }
    this.workspaceService.CreateWorkspace(formData).subscribe((res:any)=>{
      console.log(res);
      this.selectedWorkspaceId = null;
      this.modalService.dismissAll();
      this.GetWorkspaces();
    },(error)=>{
      console.log(error);
      
    });
  }

  OnDeleteSubmit()
  {
    if(!this.selectedWorkspaceId)  return;
    this.workspaceService.DeleteWorkspace(this.selectedWorkspaceId).subscribe((res:any)=>{
      console.log(res);
      this.selectedWorkspaceId = null;
      this.modalService.dismissAll();
      this.GetWorkspaces();
    },(error)=>{
      console.log(error);
      
    });
  }

  removeFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }
  }

  GetFileType(fileName: string): string
  {
    const lastDotIndex = fileName.lastIndexOf('.');
    const nameWithoutExtension = fileName.slice(0, lastDotIndex);
    const extension = fileName.slice(lastDotIndex + 1);
    return extension;
  }

  getIconName(fileName: string): string {
    const extension = this.GetFileType(fileName);
    switch (extension) {
      case 'pdf':
        return 'assets/icons/pdf.png';
      case 'txt':
        return 'assets/icons/txt.png';
      case 'css':
        return 'assets/icons/css.png';
      case 'html':
        return 'assets/icons/html.png';
      case 'js':
        return 'assets/icons/js.png';
      case 'zip':
        return 'assets/icons/zip.png';
      case 'rar':
        return 'assets/icons/rar.png';
      default:
        return 'assets/icons/unknown.png';
    }
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
