import pint
from typing import Dict, Any, Tuple

ureg = pint.UnitRegistry()

def parse_quantity(quantity_str: str) -> Tuple[float, Any]:
    """Parse a string like '5 kg' into magnitude and pint Unit."""
    try:
        q = ureg(quantity_str)
        return q.magnitude, q.units
    except (pint.errors.UndefinedUnitError, pint.errors.DimensionalityError) as e:
        raise ValueError(f"Invalid quantity: {quantity_str}. Error: {e}")

def convert_to_base_si(quantity: pint.Quantity) -> pint.Quantity:
    """Convert a pint quantity to the base SI units for calculation."""
    return quantity.to_base_units()

def validate_dimensions(q1: pint.Quantity, q2: pint.Quantity) -> bool:
    """Ensure two quantities can be added/subtracted."""
    return q1.dimensionality == q2.dimensionality
