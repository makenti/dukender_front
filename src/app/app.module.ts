import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';

// bootstrap modules
// import { AlertModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { LandingComponent } from './components/landing/landing.component';
import { AccountComponent } from './components/account/account.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ProductsComponent } from './components/products/products.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { PromotionProductsComponent } from './components/promotions/new.promotions';
import { CreatePromotionsComponent } from './components/promotions/create.promotions';
import { ShowPromotionComponent } from './components/promotions/show.promotion';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CompanyInfoComponent } from './components/company-info/company.info';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { ProposalComponent } from './components/proposal/proposal.component';
// import { ProposalPrintComponent } from './components/proposal/proposal.print';
import { PriceHistoryComponent } from './components/history/price.history';
import { PromotionHistoryComponent } from './components/history/promotion.history';
import { RequestHistoryComponent } from './components/history/request.history';
import { CustomersComponent } from './components/customers/customers.component';
import { BlackListComponent } from './components/customers/black_list.component';
import { RelationshipComponent } from './components/customers/relationship.component';

const appRoutes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'reset', component: ResetPasswordComponent },
  // { path: 'reset_success', component: ResetSuccessComponent },
  { path: 'register-1', component: RegisterComponent },
  // { path: 'register-2', component: RegisterThirdComponent },
  // { path: 'activated', component: ActivateComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'proposals', component: ProposalsComponent },
  { path: 'proposal/:id', component: ProposalComponent },
  // { path: 'proposal/print/:key', component: ProposalPrintComponent },
  { path: 'promotions', component: PromotionsComponent },
  { path: 'promotion-products', component: PromotionProductsComponent },
  { path: 'promotion-create/:type', component: CreatePromotionsComponent },
  { path: 'promotion/:id', component: ShowPromotionComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'price_history', component: PriceHistoryComponent },
  { path: 'promotion_history', component: PromotionHistoryComponent },
  { path: 'request_history', component: RequestHistoryComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'blacklist', component: BlackListComponent },
  { path: 'relationship', component: RelationshipComponent },
  { path: 'company_info', component: CompanyInfoComponent },
  // { path: 'company_region', component: CompanyRegionComponent },
  // { path: 'company_category', component: CompanyCategoryComponent },
  { path: 'account', component: AccountComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    NotFoundComponent,
    LandingComponent,
    AccountComponent,
    CustomersComponent,
    BlackListComponent,
    RelationshipComponent,
    EmployeesComponent,
    PriceHistoryComponent,
    PromotionHistoryComponent,
    RequestHistoryComponent,
    ProductsComponent,
    PromotionsComponent,
  	PromotionProductsComponent,
  	CreatePromotionsComponent,
    ShowPromotionComponent,
    ProposalsComponent,
    RegisterComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    CompanyInfoComponent,
    ProposalComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    MomentModule,
    ToastyModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
