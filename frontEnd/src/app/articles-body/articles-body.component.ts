import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Articles } from '../articles/articles.interface';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-articles-body',
  templateUrl: './articles-body.component.html',
  styleUrls: ['./articles-body.component.scss'],
})
export class ArticlesBodyComponent implements OnInit {
  sub: Subscription;
  article: Articles;
  form: FormGroup;
  alternativeImage?: string | ArrayBuffer | null;
  alternativeImageName?: string;

  @ViewChild('imageInput')
  inputElem!: ElementRef<HTMLInputElement>;

  update() {
    for (const k in this.form.value) {
      (this.article as any)[k] = this.form.value[k];
    }
    const sub = this.http
      .put<void>(`articles/updateone`, this.article)
      .pipe()
      .subscribe(
        () => {
          sub.unsubscribe();
          this.router.navigate(['articles']);
        }
        // (err) => {
        //   alert('חביבי, הייתה שגיאה!');
        // }
      );
  }

  add() {
    const data = this.form.value;

    // if (this.alternativeImage) {
    //   data.image = this.alternativeImage;
    //   data.imageName = this.alternativeImageName;
    // }

    // const sub = this.http.post<Articles>('articles', data).subscribe((item) => {
    const sub = this.http
      .post<Articles>('articles/create', data)
      .subscribe((item) => {
        sub.unsubscribe();
        this.router.navigate(['articles']);
      });
  }

  buildForm(item: Articles) {
    this.form = new FormGroup({
      title: new FormControl(item.title, [Validators.required]),
      subTitle: new FormControl(item.subTitle, [Validators.required]),
      category: new FormControl(item.category, [Validators.required]),
      author: new FormControl(item.author, [Validators.required]),
      // publishDate: new FormControl(
      //   this.date.transform(item.publishDate, 'yyyy-MM-dd'),
      //   [Validators.required]
      // ),
      body: new FormControl(item.body),
      // imgId: new FormControl(item.imgId, [Validators.required]),
    });
  }

  selectImage() {
    this.inputElem.nativeElement.click();
  }

  imageChange() {
    const files = this.inputElem.nativeElement.files;

    if (files?.length) {
      const reader = new FileReader();

      reader.onload = (ev) => {
        this.alternativeImage = ev.target?.result;
        this.alternativeImageName = files[0].name;
      };

      reader.readAsDataURL(files[0]);
    }
  }

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    // private date: DatePipe,
    private router: Router
  ) {
    this.sub = this.route.params.subscribe((data) => {
      const id: any = data['id'];

      if (id) {
        const sub = this.http
          .get<Articles>(`articles/findarticle/${id}`)
          .subscribe((data) => {
            this.article = data;
            this.buildForm(this.article);
            sub.unsubscribe();
          });
      } else {
        this.article = {
          _id: 0,
          title: '',
          subTitle: '',
          category: '',
          author: '',
          body: '',
        };

        this.buildForm(this.article);
      }
    });
  }
  ngOnInit() {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
