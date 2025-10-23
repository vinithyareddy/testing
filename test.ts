<div class="search-bar">
<input type="text" [(ngModel)]="searchQuery" placeholder="Start Typing..." (keyup.enter)="onSearchEnter()" />
<img src="assets/images/aichat/ai-chat.png" (click)="onSearchEnter()">
</div>