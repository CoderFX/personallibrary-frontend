import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainpageComponent} from "./mainpage/mainpage.component";
import {BookComponent} from "./book/book.component";

const routes: Routes = [
  {path: "", component: MainpageComponent},
  {path: "main", component: MainpageComponent},
  {path: "book", component: BookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
