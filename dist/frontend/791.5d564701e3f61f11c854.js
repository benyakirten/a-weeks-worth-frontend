(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[791],{791:(e,n,t)=>{"use strict";t.r(n),t.d(n,{AccountModule:()=>U});var o=t(8583),i=t(5666),r=t(3035),s=t(9810),a=t(3018),d=t(2479),l=t(1706),c=t(7611),u=t(665),g=t(42),p=t(6445),m=t(8424);function h(e,n){if(1&e){const e=a.EpF();a.TgZ(0,"div",6),a.TgZ(1,"button",7),a.NdJ("click",function(){a.CHM(e);const n=a.oxw();return n.passwordMode?n.togglePasswordMode():null}),a._uU(2,"Account Details"),a.qZA(),a.TgZ(3,"button",7),a.NdJ("click",function(){a.CHM(e);const n=a.oxw();return n.passwordMode?null:n.togglePasswordMode()}),a._uU(4,"Change Password"),a.qZA(),a.qZA()}if(2&e){const e=a.oxw();a.xp6(1),a.ekj("active",!e.passwordMode),a.xp6(2),a.ekj("active",e.passwordMode)}}function f(e,n){if(1&e&&(a.TgZ(0,"app-error-display"),a._uU(1),a.qZA()),2&e){const e=a.oxw();a.xp6(1),a.hij(" ",e.error," ")}}function v(e,n){if(1&e){const e=a.EpF();a.TgZ(0,"div",19),a.TgZ(1,"input",20),a.NdJ("ngModelChange",function(n){return a.CHM(e),a.oxw(2).email=n}),a.qZA(),a.TgZ(2,"label",21),a._uU(3,"Email"),a.qZA(),a.qZA()}if(2&e){const e=a.oxw(2);a.Q6J("@input",void 0),a.xp6(1),a.Q6J("ngModel",e.email)}}function w(e,n){if(1&e){const e=a.EpF();a.TgZ(0,"div",19),a.TgZ(1,"input",22),a.NdJ("ngModelChange",function(n){return a.CHM(e),a.oxw(2).username=n}),a.qZA(),a.TgZ(2,"label",23),a._uU(3,"Username"),a.qZA(),a.qZA()}if(2&e){const e=a.oxw(2);a.Q6J("@input",void 0),a.xp6(1),a.Q6J("ngModel",e.username)}}function M(e,n){if(1&e){const e=a.EpF();a.TgZ(0,"div",19),a.TgZ(1,"input",24),a.NdJ("ngModelChange",function(n){return a.CHM(e),a.oxw(2).passwordResetToken=n}),a.qZA(),a.TgZ(2,"label",25),a._uU(3,"Token"),a.qZA(),a.TgZ(4,"app-button",7),a.NdJ("click",function(){return a.CHM(e),a.oxw(2).sendPasswordResetEmail()}),a._uU(5," Send Token Email "),a.qZA(),a.qZA()}if(2&e){const e=a.oxw(2);a.Q6J("@input",void 0),a.xp6(1),a.Q6J("ngModel",e.passwordResetToken)}}function b(e,n){1&e&&(a.TgZ(0,"div",19),a._UZ(1,"input",26),a.TgZ(2,"label",27),a._uU(3,"Password"),a.qZA(),a.qZA()),2&e&&a.Q6J("@input",void 0)}function Z(e,n){1&e&&(a.TgZ(0,"div",19),a._UZ(1,"input",28),a.TgZ(2,"label",29),a._uU(3,"Repeat Password"),a.qZA(),a.qZA()),2&e&&a.Q6J("@input",void 0)}function _(e,n){1&e&&a._UZ(0,"app-loading")}function P(e,n){1&e&&a._UZ(0,"app-loading")}function C(e,n){if(1&e&&(a.TgZ(0,"span"),a._uU(1),a.qZA()),2&e){const e=a.oxw(2);a.xp6(1),a.hij("Switch to ",e.passwordMode?"Account Details":"Change Password","")}}function A(e,n){if(1&e){const e=a.EpF();a.TgZ(0,"div",8),a.TgZ(1,"div",9),a.TgZ(2,"form",10,11),a.NdJ("ngSubmit",function(){a.CHM(e);const n=a.MAs(3);return a.oxw().onSubmit(n)}),a.YNc(4,v,4,2,"div",12),a.YNc(5,w,4,2,"div",12),a.YNc(6,M,6,2,"div",12),a.YNc(7,b,4,1,"div",12),a.YNc(8,Z,4,1,"div",12),a.TgZ(9,"div",13),a.TgZ(10,"div",14),a.TgZ(11,"app-button",15),a.YNc(12,_,1,0,"app-loading",3),a._uU(13),a.qZA(),a.qZA(),a.TgZ(14,"div",14),a.TgZ(15,"app-button",16),a.NdJ("click",function(){return a.CHM(e),a.oxw().togglePasswordMode()}),a.YNc(16,P,1,0,"app-loading",3),a.YNc(17,C,2,1,"span",3),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(18,"div",17),a._UZ(19,"app-default-display-box",18),a.qZA(),a.qZA(),a.qZA()}if(2&e){const e=a.MAs(3),n=a.oxw();a.xp6(4),a.Q6J("ngIf",!n.passwordMode),a.xp6(1),a.Q6J("ngIf",!n.passwordMode),a.xp6(1),a.Q6J("ngIf",n.passwordMode),a.xp6(1),a.Q6J("ngIf",n.passwordMode),a.xp6(1),a.Q6J("ngIf",n.passwordMode),a.xp6(3),a.Q6J("disabled",n.loading||e.pristine||!e.valid||n.passwordMode&&e.value.password!==e.value.password2),a.xp6(1),a.Q6J("ngIf",n.loading),a.xp6(1),a.hij(" ",n.loading?null:"Submit"," "),a.xp6(2),a.Q6J("disabled",n.loading),a.xp6(1),a.Q6J("ngIf",n.loading),a.xp6(1),a.Q6J("ngIf",!n.loading),a.xp6(2),a.Q6J("headline",n.passwordMode?"Rules to Change Your Password":"Rules to Change Account Details")("rules",n.passwordMode?n.changePasswordRules:n.accountDetailsRules)}}function x(e,n){1&e&&a._UZ(0,"app-loading")}function y(e,n){1&e&&a._UZ(0,"app-loading")}function O(e,n){if(1&e){const e=a.EpF();a.TgZ(0,"div",30),a.TgZ(1,"p"),a._uU(2," Before you can make any modifications to your account name, password or username, your email address must be verified. You can either manually enter the token or click on the link sent in the email. "),a.qZA(),a.TgZ(3,"div",31),a.TgZ(4,"form",32,33),a.NdJ("ngSubmit",function(){a.CHM(e);const n=a.MAs(5);return a.oxw().onSubmit(n)}),a.TgZ(6,"div",19),a._UZ(7,"input",34),a.TgZ(8,"label",25),a._uU(9,"Token"),a.qZA(),a.qZA(),a.TgZ(10,"div",35),a.TgZ(11,"app-button",15),a.YNc(12,x,1,0,"app-loading",3),a._uU(13),a.qZA(),a.qZA(),a.TgZ(14,"div",35),a.TgZ(15,"app-button",16),a.NdJ("click",function(){return a.CHM(e),a.oxw().resendActivationEmail()}),a.YNc(16,y,1,0,"app-loading",3),a._uU(17),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA()}if(2&e){const e=a.MAs(5),n=a.oxw();a.xp6(4),a.Q6J("@input",void 0),a.xp6(3),a.Q6J("required",!n.verified),a.xp6(4),a.Q6J("disabled",n.loading||!e.valid),a.xp6(1),a.Q6J("ngIf",n.loading),a.xp6(1),a.hij(" ",n.loading?null:"Submit token"," "),a.xp6(2),a.Q6J("disabled",n.loading),a.xp6(1),a.Q6J("ngIf",n.loading),a.xp6(1),a.hij(" ",n.loading?null:"Send new verification token"," ")}}let q=(()=>{class e{constructor(e,n,t,o){this.store=e,this.authService=n,this.route=t,this.router=o,this.passwordMode=!1,this.verified=!1,this.loading=!1,this.accountDetailsRules=["Email and username must be at least 6 characters","Username must be no longer than 150 letters","Username must only be letters, numbers or the following symbols: _@+-. ","Email must be an email address","Email and username must be unique","User will be signed out and need to reauthenticate upon successful account update"],this.changePasswordRules=["A token must be used to change your password.\n    You can obtain this by requesting an email be sent\n    containing the token as well as a link to automatically fill it in","Password must be at least 8 characters long","Password must contain letters","Passwords must match","Password must not be too common (easy to guess)"]}ngOnInit(){this.storeSub=this.store.select("auth").subscribe(e=>{var n,t,o;this.verified=null===(n=e.user)||void 0===n?void 0:n.verified,this.username=null===(t=e.user)||void 0===t?void 0:t.username,this.email=null===(o=e.user)||void 0===o?void 0:o.email}),this.route.queryParams.subscribe(e=>{e.passwordReset&&(this.passwordMode=!0,this.passwordResetToken=e.passwordReset),e.verifyAccount&&this.handleVerifyForm(e.verifyAccount)})}sendPasswordResetEmail(){this.error=void 0,this.loading=!0,this.email?this.authService.sendPasswordResetEmail(this.email).subscribe(({data:e})=>{this.loading=!1,(null==e?void 0:e.sendPasswordResetEmail.errors)&&(this.error=this.authService.handleError(e.sendPasswordResetEmail.errors))}):this.error="Email could not be found for user."}onSubmit(e){e.valid&&!e.pristine?(this.loading=!0,this.error=void 0,this.verified?this.passwordMode?this.handlePasswordChange(e):this.handleAccountDetailsChange(e):this.handleVerifyForm(e.value.token)):this.error="Form invalid. Please make sure the data is valid"}handlePasswordChange(e){if(e.value.password!==e.value.password2)return this.loading=!1,void(this.error="Passwords do not match");this.authService.passwordReset(e.value.token,e.value.password,e.value.password2).subscribe(({data:e})=>{if(this.loading=!1,!(null==e?void 0:e.passwordReset.errors))return(null==e?void 0:e.passwordReset.success)?(this.authService.logout(),void this.router.navigate(["/auth"])):void(this.error="An error occurred. Please try again.");this.error=this.authService.handleError(e.passwordReset.errors)}),this.loading=!1}handleAccountDetailsChange(e){this.mutationSub=this.authService.updateDetails(e.value.email,e.value.username).subscribe(({errors:e})=>{e?this.error=e[0].message:(this.authService.logout(),this.router.navigate(["/auth"]))}),this.loading=!1}handleVerifyForm(e){this.mutationSub=this.authService.verifyAccount(e).subscribe(({data:e})=>{this.loading=!1,(null==e?void 0:e.verifyAccount.errors)?this.error=this.authService.handleError(e.verifyAccount.errors):(null==e?void 0:e.verifyAccount.success)?this.store.dispatch(s.lm()):this.error="Unable to verify account. Please try again."})}resendActivationEmail(){this.loading=!0,this.email?this.mutationSub=this.authService.resendActivationEmail(this.email).subscribe(({data:e})=>{this.loading=!1,(null==e?void 0:e.resendActivationEmail.errors)&&(this.error=this.authService.handleError(null==e?void 0:e.resendActivationEmail.errors))}):this.error="Email could not be found for user."}togglePasswordMode(){this.passwordMode=!this.passwordMode}ngOnDestroy(){var e,n;null===(e=this.storeSub)||void 0===e||e.unsubscribe(),null===(n=this.mutationSub)||void 0===n||n.unsubscribe()}}return e.\u0275fac=function(n){return new(n||e)(a.Y36(d.yh),a.Y36(l.e),a.Y36(i.gz),a.Y36(i.F0))},e.\u0275cmp=a.Xpm({type:e,selectors:[["app-account"]],decls:9,vars:4,consts:[[1,"container"],[1,"form-title"],["class","mode-buttons",4,"ngIf"],[4,"ngIf"],["class","verified",4,"ngIf","ngIfElse"],["notVerified",""],[1,"mode-buttons"],[3,"click"],[1,"verified"],[1,"body"],[1,"form",3,"ngSubmit"],["fDetails","ngForm"],["class","control-group",4,"ngIf"],[1,"form__buttons"],[1,"form__buttons__button"],["type","submit",3,"disabled"],["type","button",3,"disabled","click"],[1,"display-box"],[3,"headline","rules"],[1,"control-group"],["type","email","placeholder"," ","id","email","name","email",3,"ngModel","ngModelChange"],["for","email"],["type","text","placeholder"," ","id","username","name","username",3,"ngModel","ngModelChange"],["for","username"],["type","text","placeholder"," ","id","token","name","token","required","",3,"ngModel","ngModelChange"],["for","token"],["type","password","placeholder"," ","id","password","name","password","ngModel","","required","","minlength","8"],["for","password"],["type","password","placeholder"," ","id","password2","name","password2","ngModel","","required","","minlength","8"],["for","password2"],[1,"not-verified"],[1,"row"],[1,"form","form--verify",3,"ngSubmit"],["fVerify","ngForm"],["type","text","placeholder"," ","id","token","name","token","ngModel","","minlength","111","autofocus","",3,"required"],[1,"button"]],template:function(e,n){if(1&e&&(a.TgZ(0,"div",0),a.TgZ(1,"div",1),a.TgZ(2,"h1"),a._uU(3,"Account & Settings"),a.qZA(),a.YNc(4,h,5,4,"div",2),a.qZA(),a.YNc(5,f,2,1,"app-error-display",3),a.YNc(6,A,20,13,"div",4),a.YNc(7,O,18,8,"ng-template",null,5,a.W1O),a.qZA()),2&e){const e=a.MAs(8);a.xp6(4),a.Q6J("ngIf",n.verified),a.xp6(1),a.Q6J("ngIf",n.error),a.xp6(1),a.Q6J("ngIf",n.verified)("ngIfElse",e)}},directives:[o.O5,c.n,u._Y,u.JL,u.F,g.r,p.g,u.Fj,u.JJ,u.On,u.Q7,u.wO,m.N],styles:[".container[_ngcontent-%COMP%]   .form-title[_ngcontent-%COMP%]{border-bottom:1px solid #000;margin:2rem 1rem}.container[_ngcontent-%COMP%]   .form[_ngcontent-%COMP%]{width:100%}@media only screen and (max-width:56.25em){.container[_ngcontent-%COMP%]   .form--verify[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:space-between}}.container[_ngcontent-%COMP%]   .form--verify[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{margin-top:5px}@media only screen and (max-width:56.25em){.container[_ngcontent-%COMP%]   .form--verify[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{margin-left:-1rem;margin-bottom:1rem}}.container[_ngcontent-%COMP%]   .form__buttons[_ngcontent-%COMP%]{margin-left:1rem;display:flex}.container[_ngcontent-%COMP%]   .form__buttons__button[_ngcontent-%COMP%]:not(:last-child){margin-right:1rem}.container[_ngcontent-%COMP%]   .verified[_ngcontent-%COMP%]   .submit[_ngcontent-%COMP%]{margin-left:1rem}.container[_ngcontent-%COMP%]   .verified[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{display:flex;flex-direction:column}@media only screen and (max-width:56.25em){.container[_ngcontent-%COMP%]   .verified[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{flex-direction:column-reverse}}.container[_ngcontent-%COMP%]   .verified[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]   .display-box[_ngcontent-%COMP%]{width:90%}.container[_ngcontent-%COMP%]   .not-verified[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-left:1rem;margin-bottom:2rem}.container[_ngcontent-%COMP%]   .not-verified[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;align-items:center}.container[_ngcontent-%COMP%]   .not-verified[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]{display:inline-flex}.container[_ngcontent-%COMP%]   .not-verified[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .control-group[_ngcontent-%COMP%]{transform:translateY(-5px)}.container[_ngcontent-%COMP%]   .not-verified[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:first-child{margin:0 2rem}"],data:{animation:[(0,r.Ro)("input")]}}),e})();var T=t(8002);const J=[{path:"",pathMatch:"full",component:q,canActivate:[(()=>{class e{constructor(e,n){this.authService=e,this.router=n}canActivate(e,n){return this.authService.isLoggedIn.pipe((0,T.U)(e=>!!e||(this.router.navigate(["/auth"],{queryParams:{returnUrl:n.url}}),!1)))}}return e.\u0275fac=function(n){return new(n||e)(a.LFG(l.e),a.LFG(i.F0))},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()]}];let k=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[i.Bz.forChild(J)],i.Bz]}),e})();var S=t(4466);let U=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[o.ez,u.u5,k,S.m]]}),e})()}}]);