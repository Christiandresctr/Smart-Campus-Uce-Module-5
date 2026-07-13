import pytest
from app.services import validar_cedula


def test_validar_cedula_valida():
    assert validar_cedula("1710034065") is True


def test_validar_cedula_invalida():
    assert validar_cedula("1234567890") is False


def test_validar_cedula_corta():
    assert validar_cedula("12345") is False


def test_validar_cedula_con_letras():
    assert validar_cedula("123456789a") is False


def test_validar_cedula_vacia():
    assert validar_cedula("") is False