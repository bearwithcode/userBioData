import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HistogramComponent } from './hostogram/histogram.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClinicalDatabaseService } from './clinical-database.service';
import { HttpClientModule } from '@angular/common/http';
import { HistogramDiagramComponent } from './histogram-diagram/histogram-diagram.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HistogramComponent,
    HistogramDiagramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(ClinicalDatabaseService),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
