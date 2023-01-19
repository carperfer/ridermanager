import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, EventEmitter, Output, HostBinding, Optional, Self } from '@angular/core';
import { AbstractControl, ValidationErrors, NgControl, FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { Address } from 'src/app/interfaces/google-data';
@Component({
  selector: 'app-google-address',
  templateUrl: './google-address.component.html',
  styleUrls: ['./google-address.component.scss'],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class GoogleAddressComponent implements OnInit, AfterViewInit, Validator {
  private nextId = 0;
  @ViewChild('addressInput') addressInput: ElementRef<HTMLInputElement>;
  addressForm: FormGroup;
  @HostBinding() id = `google-address-input-${this.nextId++}`;
  @Input() customerIsSelected: boolean;
  @Input() Placeholder: string;
  @Input('aria-describedby') userAriaDescribedBy: string;
  @Input()
  get value(): string | null {
    if (this.addressForm.value.googleAddress) {
      return this.addressForm.value.googleAddress;
    }
    return null;
  }

  set value(address: string | null) {
    if (address !== null) {
      this.addressForm.value.googleAddress = address;
      this.stateChanges.next();
    }
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  focused = false;

  get empty() {
    return !this.addressForm.value.googleAddress;
  }
  // ngControl: NgControl = null;
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.addressForm.disable() : this.addressForm.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  get errorState(): boolean {
    return this.addressForm.invalid && this.touched;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Output() addressSelected: EventEmitter<Address> = new EventEmitter();

  // @HostListener('focus')
  // onFocus(input: unknown) {
  // }


  autocomplete: google.maps.places.Autocomplete;
  address: string | null;
  completeAddress: Address;
  touched = false;
  stateChanges = new Subject<void>();
  controlType = 'google-address-input';
  validationError: boolean = false;
  onChange = (address: string | null) => { };
  onTouched = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl, private _elementRef: ElementRef<HTMLElement>, fb: FormBuilder) {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    this.addressForm = fb.group({
      'googleAddress': [
        null,
        [Validators.required]
      ]
    });

    this.customerIsSelected = false;

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
      componentRestrictions: { country: 'ES' },
      types: ['address']
    })

    // this.addressInput.nativeElement.focus();
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.addressInput.nativeElement.focus();
    }
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement
      .querySelector('.google-address-input-container')!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  private fillInAddress() {
    this.markAsTouched();
    if (!this._disabled) {
      const place = this.autocomplete.getPlace();
      let address = "";
      let address_info = "";
      let postcode = "";
      let city = "";

      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        const componentType = component.types[0];

        switch (componentType) {
          case "street_number": {
            address_info = component.long_name;
            break;
          }
          case "route": {
            address += component.short_name;
            break;
          }
          case "postal_code": {
            postcode = component.long_name;
            break;
          }
          case "locality": {
            city = component.long_name;
            break;
          }
        }
      }
      address = `${address}, ${address_info}`;
      this.completeAddress = {
        address: address,
        zip: postcode,
        city: city,
        lat: place.geometry?.location.lat() ?? 0,
        lng: place.geometry?.location.lng() ?? 0
      }
      this.addressInput.nativeElement.value = address;
      this.onChange(address);
      this.addressSelected.emit(this.completeAddress);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const addressValue = control.value;
    if (addressValue === '') {
      return {
        mustBePositive: {
          addressValue
        }
      };
    }
    return null;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this._disabled = disabled;
  }

  writeValue(address: string): void {
    // if (this.addressForm.value.googleAddress) {
    this.addressForm.controls.googleAddress.setValue(address);
    // }
    // this.addressInput.nativeElement.value = address;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
    // this.addressSelected.emit(onChange);
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;

  reset() {
    this.validationError = false;
    this.addressForm.reset();
  }

  markError() {
    Object.keys(this.addressForm.controls).forEach(key => {
      this.addressForm.get(key)?.markAsDirty();
    });
    this.validationError = true;
  }
}
