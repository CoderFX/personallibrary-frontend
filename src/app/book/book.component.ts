import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";


export class Book {
  constructor(
    public book_id: number,
    public title: string,
    public year: number
  ) {
  }
}

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books: Book[];
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getBooks();

    this.editForm = this.fb.group(
      {
        book_id: [''],
        title: [''],
        year: ['']
      }
    );
  }

  getBooks() {
    this.httpClient.get<any>('http://localhost:8080/api/book/all').subscribe(
      response => {
        console.log(response);
        this.books = response;
      }
    );
  }

  open(content)
  {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8080/api/book/add';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openDetails(targetModal, book: Book) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    document.getElementById('btitle').setAttribute('value', book.title);
    document.getElementById('byear').setAttribute('value', String(book.year));
  }

  openEdit(targetModal, book: Book) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      book_id: book.book_id,
      title: book.title,
      year: book.year
    });
  }

  onSave() {
    const editURL = 'http://localhost:8080/api/book/' + this.editForm.value.book_id + '/edit';
    console.log(this.editForm.value);
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, book: Book) {
    this.deleteId = book.book_id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:8080/api/book/' + this.deleteId + '/delete';
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
}
