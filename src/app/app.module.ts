import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { TooltipModule } from 'ngx-tooltip';
import { ImageCropperModule } from 'ng2-img-cropper/index';

// bootstrap modules
// import { AlertModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MyDatePickerModule } from 'mydatepicker';
import { Daterangepicker } from 'ng2-daterangepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { NotFoundComponent } from './common/not-found/not-found.component';

import { LandingComponent } from './components/landing/landing.component';

import { AccountComponent } from './components/account/account.component';
import { ResetSuccessComponent } from './components/auth/reset_success';
import { ActivateComponent } from './components/auth/activate.component';

import { EmployeesComponent } from './components/employees/employees.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductModal } from './components/products/product-modal.component';
import { CreateCategoryComponent } from './components/products/create-category.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { PromotionProductsComponent } from './components/promotions/new.promotions';
import { CreatePromotionsComponent } from './components/promotions/create.promotions';
import { ShowPromotionComponent } from './components/promotions/show.promotion';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CompanyInfoComponent } from './components/company-info/company.info';
import { CompanyCategoryComponent } from './components/company-info/company.category';
import { CompanyRegionsComponent } from './components/company-info/company.regions';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { ProposalComponent } from './components/proposal/proposal.component';
// import { ProposalPrintComponent } from './components/proposal/proposal.print';
import { PriceHistoryComponent } from './components/history/price.history';
import { PromotionHistoryComponent } from './components/history/promotion.history';
import { RequestHistoryComponent } from './components/history/request.history';
import { CustomersComponent } from './components/customers/customers.component';
import { BlackListComponent } from './components/customers/black_list.component';
import { RelationshipComponent } from './components/customers/relationship.component';
import { NotificationComponent } from './components/notifications/notifications.component';

import { SearchPipe } from './pipes/search.pipe';
import { SearchDeepPipe } from './pipes/searchDeep.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { ReadPipe } from './pipes/read.pipe';


import {
  AuthService,
  CategoryService,
  CompanyProfileService,
  ProductService,
  PromotionService,
  AccountService,
  ProposalService,
  CustomersService,
  AuthManager,
  CompanyRegionsService,
  ErrorService,
  ToolbarService
   } from './services/index';

const appRoutes: Routes = [
  { path: 'landing', component: LandingComponent, canActivate: [AuthManager] },
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'reset_success', component: ResetSuccessComponent },
  { path: 'register-1', component: RegisterComponent },
  { path: 'register-2', component: CompanyCategoryComponent },
  { path: 'activated', component: ActivateComponent },
  
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthManager] },
  { path: 'home', component: DashboardComponent, canActivate: [AuthManager] },
  { path: 'proposals', component: ProposalsComponent, canActivate: [AuthManager] },
  { path: 'proposal/:id', component: ProposalComponent, canActivate: [AuthManager] },
  // { path: 'proposal/print/:key', component: ProposalPrintComponent, canActivate: [AuthManager] },
  { path: 'promotions', component: PromotionsComponent, canActivate: [AuthManager] },
  { path: 'promotion-products', component: PromotionProductsComponent, canActivate: [AuthManager] },
  { path: 'promotion-create/:type', component: CreatePromotionsComponent, canActivate: [AuthManager] },
  { path: 'promotion/:id', component: ShowPromotionComponent, canActivate: [AuthManager] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthManager] },
  { path: 'price_history', component: PriceHistoryComponent, canActivate: [AuthManager] },
  { path: 'promotion_history', component: PromotionHistoryComponent, canActivate: [AuthManager] },
  { path: 'request_history', component: RequestHistoryComponent, canActivate: [AuthManager] },
  { path: 'employees', component: EmployeesComponent, canActivate: [AuthManager] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthManager] },
  { path: 'blacklist', component: BlackListComponent, canActivate: [AuthManager] },
  { path: 'relationship', component: RelationshipComponent, canActivate: [AuthManager] },
  { path: 'company_info', component: CompanyInfoComponent, canActivate: [AuthManager] },
  { path: 'company_category', component: CompanyCategoryComponent, canActivate: [AuthManager] },
  { path: 'company_region', component: CompanyRegionsComponent, canActivate: [AuthManager] },
  { path: 'account', component: AccountComponent, canActivate: [AuthManager] },
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthManager] },
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
    ResetSuccessComponent,
    ActivateComponent,
    CustomersComponent,
    BlackListComponent,
    RelationshipComponent,
    EmployeesComponent,
    PriceHistoryComponent,
    PromotionHistoryComponent,
    RequestHistoryComponent,
    ProductsComponent,
    ProductModal,
    CreateCategoryComponent,
    PromotionsComponent,
  	PromotionProductsComponent,
  	CreatePromotionsComponent,
    ShowPromotionComponent,
    ProposalsComponent,
    RegisterComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    CompanyInfoComponent,
    CompanyCategoryComponent,
    ProposalComponent,
    CompanyRegionsComponent,
    NotificationComponent,
    SearchPipe,
    SortPipe,
    SearchDeepPipe,
    ReadPipe,
    // ProposalPrintComponent
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
    ModalModule.forRoot(),
    MyDatePickerModule,
    BsDropdownModule.forRoot(),
    Daterangepicker,
    TooltipModule,
    ImageCropperModule
  ],
  providers: [
    AuthService,
    CategoryService,
    CompanyProfileService,
    ProductService,
    PromotionService,
    AccountService,
    ProposalService,
    CustomersService,
    AuthManager,
    CompanyRegionsService,
    ErrorService,
    ToolbarService
  ],
  bootstrap: [AppComponent],
  exports: [
    ImageCropperModule
  ]
})
export class AppModule { }
