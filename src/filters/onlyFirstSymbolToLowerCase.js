export default function onlyFirstSymbolToLowerCase (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toLowerCase()
}