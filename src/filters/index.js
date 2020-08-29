import dateFilter from './dateFilter';
import onlyFirstSymbol from './onlyFirstSymbol';
import firstSymbolToLowerCase from './firstSymbolToLowerCase';
import firstSymbolToUpperCase from './firstSymbolToUpperCase';
import onlyFirstSymbolToLowerCase from './onlyFirstSymbolToLowerCase';
import onlyFirstSymbolToUpperCase from './onlyFirstSymbolToUpperCase';
import reverseArray from './reverseArray';


export default {
    install(Vue) {
        Vue.filter('dateFilter', dateFilter);
        Vue.filter('onlyFirstSymbol', onlyFirstSymbol);
        Vue.filter('firstSymbolToLowerCase', firstSymbolToLowerCase);
        Vue.filter('firstSymbolToUpperCase', firstSymbolToUpperCase);
        Vue.filter('onlyFirstSymbolToLowerCase', onlyFirstSymbolToLowerCase);
        Vue.filter('onlyFirstSymbolToUpperCase', onlyFirstSymbolToUpperCase);
        Vue.filter('reverseArray', reverseArray);
    }
}