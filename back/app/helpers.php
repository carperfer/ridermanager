<?php

if (!function_exists('get_cache_store')) {
    /**
     * Get the name of the main cache store.
     *
     * @return string
     */
    function get_cache_store(): string
    {
        return config('global.cache_store');
    }
}

if (!function_exists('trim_attr')) {
    /**
     * Trim attributes to remove white spaces.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Request
     */
    function trim_attr(\Illuminate\Http\Request $request): \Illuminate\Http\Request
    {
        $attributes = $request->all();
        foreach ($attributes as &$attribute) {
            $attribute = is_string($attribute) ? trim($attribute) : $attribute;
        }
        $request->replace($attributes);

        return $request;
    }
}
