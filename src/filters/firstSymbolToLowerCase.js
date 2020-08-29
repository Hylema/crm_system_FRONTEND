export default function firstSymbolToLowerCase (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toLowerCase() + value.slice(1)
}