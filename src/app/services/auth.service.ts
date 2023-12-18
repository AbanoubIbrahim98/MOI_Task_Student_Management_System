import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { ToastService } from './toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router, private toastr: ToastService) { }
  message: string = ''

 /* private students = [
    { id: 1, name: 'Abanoub Ibrahim', year: 'Primary', class: 'Class A', grades: { subject1: 90, subject2: 95 } },
    // Add more student data
  ];*/

  //Login notifications

  OnShowLoginSuccess(){
   this.toastr.showLoginSucces();
  }

  OnShowLoginError(){
    this.toastr.showLoginError();
  }

  OnShowLoginInfo(){
    this.toastr.showLoginInfo();
  }

  //Register notifications

   OnShowRegistrationSuccess(){
    this.toastr.showRegistrationSucces();
   }

   OnShowRegistrationWarning(){
     this.toastr.showRegistrationWarning();
  }

  //Logout notification

  OnShowUserLoggedOutInfo(){
    this.toastr.showUserLoggedOutInfo();
 }

   //Forgot password notification

   OnShowForgotPasswordInfo(){
    this.toastr.showForgotPasswordInfo();
 }

 OnShowForgotPasswordError(){
  this.toastr.showForgotPasswordError();
}
  //login method

  login(email : string, password : string): void {
    this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
        localStorage.setItem('token','true');

        if(res.user?.emailVerified == true){
          this.OnShowLoginSuccess();
          this.router.navigate(['dashboard']);
        } else{
          this.router.navigate(['login']);
          this.OnShowLoginInfo();
        }

    }, err => {
        this.OnShowLoginError();
        this.router.navigate(['/login']);
    })
  }

 //register method

 register(email : string, password : string) {
  this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
    this.OnShowForgotPasswordInfo();
    this.OnShowRegistrationSuccess();
    this.sendEmailForVarification(res.user);
    this.router.navigate(['/login']);
  }, err => {
    this.OnShowRegistrationWarning();
    this.router.navigate(['/register']);
  })
}

 //sign out method

  logout() {
    this.OnShowUserLoggedOutInfo();
    this.fireauth.signOut().then(() =>{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  //forgot password method

 forgotPassword(email : string){
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.OnShowForgotPasswordInfo();
      this.router.navigate(['/login']);
    }, err => {
      this.OnShowForgotPasswordError();
    })
 }


  //email varification
  sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/login']);
    }, (err : any) => {
      this.OnShowForgotPasswordError();
    })
  }

    //sign in with google
    googleSignIn() {
      return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

        this.router.navigate(['/dashboard']);
        localStorage.setItem('token',JSON.stringify(res.user?.uid));
        this.OnShowRegistrationSuccess();

      }, err => {
        this.OnShowRegistrationWarning();
      })
    }



  /*private usersUrl = './assets/data/users.json'; // Path to your user data JSON file
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any[]> {
    // In a real-world scenario, you would call your authentication API here
    // For demonstration purposes, we'll read user data directly from a JSON file
    return this.http.get<any[]>(this.usersUrl);
  }

  generateToken(user: any): string {
    // In a real-world scenario, you would get the user data from the authentication response
    // For demonstration purposes, we'll use a hardcoded user object
    const tokenPayload = { sub: user.id, username: user.username, role: user.role };

    // There is no direct encoding here; assume the token is obtained from the server
    return 'your-actual-token-from-the-server';
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  */
}
