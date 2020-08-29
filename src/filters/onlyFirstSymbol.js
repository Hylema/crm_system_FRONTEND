export default function onlyFirstSymbol (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase()
}