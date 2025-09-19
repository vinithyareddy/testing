<span [class]="'fi fi-' + c.code.toLowerCase()" 
      class="flag-icon"
      [title]="c.country"></span>


      @import 'flag-icons/css/flag-icons.min.css';


      .flag-icon {
        width: 20px;
        height: 14px;
        display: inline-block;
        margin-right: 8px;
        vertical-align: middle;
        
        @include mobile {
          width: 16px;
          height: 12px;
          margin-right: 5px;
        }
      }