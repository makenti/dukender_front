import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/index';

@Injectable()
export class ErrorService {

  constructor(
    public http: Http,
    public auth: AuthService
  ) { }

  getCodeMessage(code: number) {
    let errorMessage: string = '';
    switch (code) {
      case 1:
        errorMessage = 'Не правильный запрос'; //BAD_REQUEST
        break;
      case 2:
        errorMessage = 'Не правильный токен'; //TOKEN_INVALID 
        break;
      case 3:
        errorMessage = 'Сессия завершена'; //TOKEN_EXPIRED
        break;
      case 4:
        errorMessage = 'Извините, но пользователь с таким почтовым адресом уже существует';
        break;
      case 5:
        errorMessage = 'Вы ввели неверный логин или пароль. Попробуйте еще раз';
        break;
      case 6:
        errorMessage = 'USER_NOT_VERIFIED';
        break;
      case 7:
        errorMessage = 'ACTIVATION_CODE_NOT_FOUND';
        break;
      case 8:
        errorMessage = 'Неправильный имейл';
        break;
      case 9:
        errorMessage = 'PASSWORD_LENGTH_ERROR';
        break;
      case 10:
        errorMessage = 'KEY_USED';
        break;
      case 11:
        errorMessage = 'Доступ запрещен';
        break;
      case 12:
        errorMessage = 'COMPANY_BLOCKED';
        break;
      case 13:
        errorMessage = 'COMPANY_ENTRY_DOESNT_EXIST';
        break;
      case 14:
        errorMessage = 'COMPANY_ALREADY_EXISTS';
        break;
      case 15:
        errorMessage = 'Неправильные данные в параметрах запроса';
        break;
      case 16:
        errorMessage = 'BIN_NOT_CHANGEABLE';
        break;
      case 17:
        errorMessage = 'USER_CAN_HAVE_ONLY_ONE_COMPANY';
        break;
      case 18:
        errorMessage = 'COMPANY_ENTRIES_DOESNT_MATCH';
        break;
      case 19:
        errorMessage = 'VALIDATION_ERROR';
        break;
      case 20:
        errorMessage = 'Неверный JSON формат';
        break;
      case 21:
        errorMessage = 'Компания не найдена';
        break;
      case 22:
        errorMessage = 'USER_CAN_HAVE_ONLY_ONE_SHOP';
        break;
      case 23:
        errorMessage = 'SHOP_ENTRY_DOESNT_EXIST';
        break;
      case 25:
        errorMessage = 'Пользователь уже активен';
        break;
      case 24:
        errorMessage = 'Язык не существует';
        break;
      case 26:
        errorMessage = 'SELF_ASSIGN_DEPRECATED';
        break;
      case 27:
        errorMessage = 'USER_DOESNT_EXIST';
        break;
      case 28:
        errorMessage = 'PHONE_IN_CORRECT';
        break;
      case 29:
        errorMessage = 'Акция не найдена';
        break;
      case 30:
        errorMessage = 'Продукт не найден';
        break;
      case 31:
        errorMessage = 'DISTRICT_DOESNT_EXIST';
        break;
      case 32:
        errorMessage = 'REQUEST_NOT_CHANGEABLE';
        break;
      case 33:
        errorMessage = 'Заявка не найдена';
        break;
      case 34:
        errorMessage = 'CODE_INVALID';
        break;
      case 50:
        errorMessage = 'Не правильная форма прайс-листа';
        break;
      case 51:
        errorMessage = 'NO_ACTIVE_PRICE';
        break;
      case 52:
        errorMessage = 'Прайс лист не актуален';
        break;
      case 53:
        errorMessage = 'Ошибка киви';
        break;
      case 54:
        errorMessage = 'Не получилось добавить товары, вы превысили количество товаров';
        break;
      case 55:
        errorMessage = 'Сумма должна превышать 0';
        break;
      case 56:
        errorMessage = 'QIWI_ERROR1';
        break;
      case 57:
        errorMessage = 'QIWI_ERROR2';
        break;
      case 58:
        errorMessage = 'QIWI_ERROR3';
        break;
      case 59:
        errorMessage = 'QIWI_ERROR4';
        break;
      case 60:
        errorMessage = 'Для подключения услуги необходимо оплатить долг. После оплаты автоматически идет подключение';
        break;
      case 61:
        errorMessage = 'INCORRECT_HTTP_METHOD ';
        break;
      case 62:
        errorMessage = 'Пользователь не найден ';
        break;
      case 63:
        errorMessage = 'Компания проверена';
        break;
      case 403:
        errorMessage = 'Ошибка безопасности';
        break;
      case 888:
        errorMessage = 'UNKNOWN_ERROR';
        break;
      case 999:
        errorMessage = 'SERVER_ERROR';
        break;
      default:
        errorMessage = 'SERVER_ERROR';
        break;
    }

    return errorMessage;
  }
}
