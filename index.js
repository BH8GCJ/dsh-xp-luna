/**
 * Host half of the XP Luna skin bundle.
 *
 * The skin is entirely a Client concern: the browser module stacks an alias-token
 * override layer through `ctx.theme`. This Host entry exists so the bundle has a
 * mountable row of its own, which is what the Plugin Manager toggles.
 */
export function apply() {}
