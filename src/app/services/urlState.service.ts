import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserImageService {
  private _userImageUrl = signal<string>('');

  userImageUrl = this._userImageUrl.asReadonly();

  updateUserImageUrl(url: string) {
    this._userImageUrl.set(url);
  }

  clearUserImageUrl() {
    this._userImageUrl.set('');
  }
}
