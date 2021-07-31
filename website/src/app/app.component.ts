import { Component } from '@angular/core';
import Web3 from 'web3';
import * as tokenSaleContract from "../assets/sampleTokenSale.json"
import * as tokenContract from "../assets/sampleToken.json";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sample token sales';
  loading = true;
  content = false;
  web3: any;
  account:any;
  sampleToken:any;
  sampleTokenSale:any;
  sampleTokenSaleContractAddress = "0x688DcD343aCEF5BBE861CFF4523902450874D5E1";
  sampleTokenContractAddress = "0x7F107e5e7e7E464f242B4b0E2F2c62F36be270D7";
  tokenPrice:any;
  tokensSold:any;
  tokensAvailable = 750000;
  salesProgress:any;
  public sampleTokenBalance:any;
  price:number;
  public refreshToke= new BehaviorSubject<number>(0)
  loggedIn:number;
  tokenForm = new FormGroup({
    numberOfTokens: new FormControl('', [Validators.required])
  })
  constructor() {

  }
   ngOnInit() {
    this.initializeWeb3();
    this.initializeContract(); 
     this.refreshToke.subscribe(value => {
       this.sampleTokenBalance = value;
     });
  }

  async initializeWeb3() {
    this.web3 = new Web3('ws://localhost:7545');// connec
  }

  async initializeContract(){
    let accounts = await this.web3.eth.getAccounts();
    this.account = accounts[1];

    this.sampleToken  = new this.web3.eth.Contract((<any>tokenContract).default, this.sampleTokenContractAddress);
    this.sampleTokenSale = new this.web3.eth.Contract((<any>tokenSaleContract).default,  this.sampleTokenSaleContractAddress);
    this.price = await this.sampleTokenSale.methods.tokenPrice().call();
    this.tokenPrice = this.web3.utils.fromWei(this.price, "ether");
    this.tokensSold = await this.sampleTokenSale.methods.tokenSold().call();
    this.salesProgress = (Math.ceil(this.tokensSold)/this.tokensAvailable) * 100;
    this.sampleTokenBalance = await this.sampleToken.methods.balanceOf(this.account).call();    
   
    this.loading = false;
    this.content = true;
  }

  async buyTokens(){
    
    let numberOfTokens = +this.tokenForm.value.numberOfTokens;
    let valueToBuy = this.price * numberOfTokens;
    this.sampleTokenSale.methods.buyTokens(numberOfTokens).send({from: this.account,gasPrice: '10000000000000',gas: 1000000, value: valueToBuy })
    .on('receipt', (receipt)=>{
      const newSampleTokenBalance = (+receipt.events.Sell.returnValues._amount) + (+this.sampleTokenBalance);


      this.refreshToke.next(newSampleTokenBalance);
    });
    this.tokensSold = await this.sampleTokenSale.methods.tokenSold().call();
  }
}
