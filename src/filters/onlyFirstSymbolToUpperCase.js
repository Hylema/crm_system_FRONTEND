export default function onlyFirstSymbolToUpperCase (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase()
}