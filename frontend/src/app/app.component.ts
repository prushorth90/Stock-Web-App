import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { shareService } from './share.service';
import { interval, Subscription, switchMap } from 'rxjs'; // Import RxJS tools

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  
  `
})
export class AppComponent implements OnInit, OnDestroy {
  shares: any[] = [];
  newSymbol = '';
  errorMessage = '';
  private pollSub!: Subscription;

  constructor(private shareService: shareService) {}

  ngOnInit() {
    this.fetchshares();
    
    // Poll the backend every 5 seconds to see the latest Yahoo data
    this.pollSub = interval(5000)
      .pipe(switchMap(() => this.shareService.getshares()))
      .subscribe(data => this.shares = data);
  }

  ngOnDestroy() {
    if (this.pollSub) this.pollSub.unsubscribe();
  }

  fetchshares() {
    this.shareService.getshares().subscribe(data => this.shares = data);
  }

  addshare() {
    if (!this.newSymbol) return;
    this.errorMessage = '';
    
    // Reset inputs immediately for better UX
    const symbolToAdd = this.newSymbol;
    this.newSymbol = '';

    this.shareService.addshare({ symbol: symbolToAdd }).subscribe({
      next: () => this.fetchshares(),
      error: (err) => {
        this.errorMessage = err.error.error || 'Failed to add share';
        // Put the text back if it failed so they can correct it
        this.newSymbol = symbolToAdd; 
      }
    });
  }

  deleteshare(id: string) {
    // Optimistic update: remove from UI immediately
    this.shares = this.shares.filter(s => s._id !== id);
    // Then tell server
    this.shareService.deleteshare(id).subscribe();
  }
}