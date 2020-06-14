import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'ng-zorro-antd-mobile';

interface Address {
  city: string[];
  line1: string;
  line2: string;
  name: string;
}

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.less'],
})
export class ShippingComponent implements OnInit {
  address: Address = {
    city: [''],
    line1: '',
    line2: '',
    name: '',
  };

  isLoding = false;

  singleArea = ['東京'];

  constructor(private http: HttpClient, private toast: ToastService) {}

  async getValueWithAsync() {
    const stripe = await loadStripe(
      'pk_test_51GqunzFvpS87CzIaXo5COmFqht9TsaVqX3lMF3OnmGnLcM5hwMHzDKNoSYcKEgEREstSsBLBN4HGFYfBVrJMHQHY0039Do9CJt'
    );
    return stripe;
  }

  handleErr() {
    this.toast.fail('住所をご記入ください', 1000);
  }

  handleClick() {
    for (const key in this.address) {
      if (this.address.hasOwnProperty(key)) {
        if (key === 'city' && this.address[key].length === 0) {
          this.handleErr();
          return;
        } else if (this.address[key] === '') {
          this.handleErr();
          return;
        }
      }
    }
    this.isLoding = true;
    this.http
      .post(
        `https://asia-east2-vernal-dispatch-279613.cloudfunctions.net/check-out`,
        this.address
      )
      .subscribe((res: any) => {
        this.isLoding = false;
        this.getValueWithAsync().then((stripe) => {
          stripe.redirectToCheckout({
            sessionId: res.id,
          });
        });
      });
  }

  ngOnInit(): void {}
}
