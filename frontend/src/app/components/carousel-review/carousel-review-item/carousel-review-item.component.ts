import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { MovieDetails } from '../../../models/movie-details';
import { TVSeriesDetails } from '../../../models/tvseries-details';
import { TmdbService } from '../../../services/tmdb.service';
import { ReviewService } from '../../../services/review.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { StarRatingComponent } from '../../star-rating/star-rating.component';
import { TitlePipe } from '../../../pipes/title.pipe';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';

@Component({
  selector: 'app-carousel-review-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    TitlePipe,
    StarRatingComponent,
    MatDialogModule
  ],
  templateUrl: './carousel-review-item.component.html',
  styleUrl: './carousel-review-item.component.css'
})
export class CarouselReviewItemComponent implements OnInit {
  @Input() movieOrTvSeries: string = ""; // MOVIES or TVSERIES****
  @Input() tmdbId: number = 0; // Movie or TV id
  movieDetails: MovieDetails;
  tvSeriesDetails: TVSeriesDetails;
  loadingData: boolean = true;

  imgWidth:number = 210;
  imgHeight:number = 350;

  // For star highlight component input to display highlighted stars in review mode
  reviewRating: number;

  constructor(
    private _tmdbService: TmdbService,
    public dialog: MatDialog,
    private _reviewService: ReviewService,
  ) {}

  ngOnInit(): void {
    this.getDetails()
  }

  getDetails(): void {
    switch(this.movieOrTvSeries) {
      case "MOVIES":
        this.getMovieDetails();
        /*
        this._reviewService.movieReviewsChanged.subscribe(value => {
          this.reviewRating = this._reviewService.getReview(this.id).rating;
        });
        */
        break;
      case "TVSERIES":
        this.getTvSeriesDetails();
        /*
        this._reviewService.tvSeriesReviewsChanged.subscribe(value => {
          this.reviewRating = this._reviewService.getReview(this.id).rating;
        });
        */
        break;
      default:
        console.log("Movie or Tvseries Error");
        break;
    }
  }

  /** Get Movie Details */
  getMovieDetails(): void {
    this._tmdbService.getMovieDetails(this.tmdbId)
    .subscribe(
      data => {
        // console.log(data);
        this.movieDetails = {...data};
        this.setMovieCardDetails();
        this.setStarRating();
        this.loadingData = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  /** Set Movie details */
  setMovieCardDetails(): void {
    // this.movieDetails.poster_path = `https://image.tmdb.org/t/p/original/` + this.movieDetails.poster_path;
    this.movieDetails.poster_path = `https://image.tmdb.org/t/p/w342/` + this.movieDetails.poster_path;
  }

  /** Get TV Series Details */
  getTvSeriesDetails(): void {
    this._tmdbService.getTVSeriesDetails(this.tmdbId)
    .subscribe(
      data => {
      // console.log(data);
      this.tvSeriesDetails = {...data};
      this.setTvSeriesCardDetails();
      this.setStarRating();
      this.loadingData = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  /** Set TV Series Details */
  setTvSeriesCardDetails(): void {
    // this.tvSeriesDetails.poster_path = `https://image.tmdb.org/t/p/original/` + this.tvSeriesDetails.poster_path;
    this.tvSeriesDetails.poster_path = `https://image.tmdb.org/t/p/w342/` + this.tvSeriesDetails.poster_path;
  }

  setStarRating(): void {
    // For star highlight
    switch(this.movieOrTvSeries) {
      case "MOVIES":
        /*
        let currentMovieReview = this._reviewService.getReview(this.id);
        console.log(currentMovieReview);
        if (currentMovieReview != undefined) {
          this.reviewRating = currentMovieReview.rating;
        }
        */
        break;
      case "TVSERIES":
        /*
        let currentTVSeriesReview = this._reviewService.getReview(this.id);
        console.log(currentTVSeriesReview);
        if(currentTVSeriesReview != undefined) {
          this.reviewRating = currentTVSeriesReview.rating;
        }
        */
        break;
      default:
        console.log("Movie or Tvseries Error");
        break;
    }
  }

  /** Open Dialog */
  openEditDialog(): void {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: {
        id: this.tmdbId,
        movieOrTvSeries: this.movieOrTvSeries
      },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
