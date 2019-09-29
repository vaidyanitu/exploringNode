import { Component, OnInit } from '@angular/core';
import { TokenPayLoad} from '../model/user.model';
import { SigninService } from '../services/signin.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
credentials: TokenPayLoad = {
  email: '',
  password: '',
  name: ''
};
//submitted = false;
  constructor(private signinService: SigninService) { }

  ngOnInit() {
  }

  signup(isvalid: boolean) {
    //this.submitted = true;
    if(isvalid) {
    console.log('signup submitted');
    console.log(this.credentials);
    let x = this.signinService.getData().subscribe(data => {
      console.log(data);
    });
    console.log(x);
    }
  }

}
