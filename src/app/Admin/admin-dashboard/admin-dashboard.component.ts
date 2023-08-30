import { Component,OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit
{

  users:any = [];
  selectedUserid:any = null;
  selectedUser:any = null;

  constructor(private userService:UserService,
    private modalService: NgbModal,
    private formValidatorService:FormValidatorService){}

    userForm = new FormGroup({
      username :new FormControl('',Validators.required),
      email :new FormControl('',[Validators.required,Validators.email]),
      password :new FormControl('',Validators.required),
    });
    userForm2 = new FormGroup({
      username :new FormControl('',Validators.required),
      email :new FormControl('',[Validators.required,Validators.email]),
      password :new FormControl('')
    });

  ngOnInit(): void 
  {
    this.GetAllUsers();
  }

  openModal(component:any,size:string="md",userId:any = null)
  {
    this.selectedUserid = userId;
    const modalRef = this.modalService.open(component,{
      size: size,
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });

    this.userForm.reset();
    this.userForm2.reset();
    this.selectedUser = null;
    if(userId)
    {
      this.userService.GetUser(userId).subscribe((res:any)=>{
        this.userForm2.patchValue(res);
        this.selectedUser = res;
      });
    }

  }

  GetAllUsers()
  {
    this.userService.GetUsers().subscribe((res:any)=>{
      this.users = res;
    },(error)=>{
      console.log(error);
    });
  }

  OnCreateUserSubmit()
  {
    if(this.userForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.userForm);
      return;
    }

    const formData = this.userForm.value;
    this.userService.CreateUser(formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllUsers();
    },(error)=>{
      console.log(error);
      
    })
  }

  OnUpdateUserSubmit()
  {
    if(this.userForm2.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.userForm2);
      return;
    }

    const formData = this.userForm2.value;
    this.userService.UpdateUser(this.selectedUserid,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllUsers();
    },(error)=>{
      console.log(error);
      
    })
  }

  OnDeleteUserSubmit()
  {
    this.userService.DeleteUser(this.selectedUserid).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllUsers();
    },(error)=>{
      console.log(error);
      
    })
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
