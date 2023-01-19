<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

abstract class BaseModel extends Model
{
    /**
     * Get a model searching by a given field and value, check if exists, and return the result.
     *
     * @param string          $field The attribute to search by
     * @param int|string|null $value The value that the attribute must have
     * @return mixed
     */
    public static function getByField(string $field, mixed $value = null): mixed
    {
        if ($field === '') {
            throw new ModelNotFoundException('attr_' . $field);
        }
        $class = new static;
        $model = $class::where($field, '=', $value)->first();
        if (!$model) {
            throw new ModelNotFoundException('model_' . strtolower(class_basename($class)));
        }
        return $model;
    }

    /**
     * Get a model and compare one of its attribute to the given value.
     *
     * @param int        $modelId   The id of the model to find
     * @param string     $attribute The field to compare
     * @param int|string $value     The value that the attribute must be compare with
     * @return mixed
     */
    public static function getAndCheck(int $modelId, string $attribute, int|string $value): mixed
    {
        $class = new static;
        $model = $class::find($modelId);

        if (!$model || $model->$attribute !== $value) {
            throw new ModelNotFoundException('model_' . strtolower(class_basename($class)));
        }

        return $model;
    }

    /**
     * Get the model with the ID given or the default value defined in the model.
     *
     * @param int|null $id
     * @return mixed
     */
    public static function getOrDefault(?int $id = null): mixed
    {
        $class = new static;
        $default = $class::DEFAULT_VALUE ?? null;

        return $class::find($id) ?? $class::where('name', '=', $default)->first();
    }

}
