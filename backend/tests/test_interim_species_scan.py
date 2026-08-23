import io

from fastapi.testclient import TestClient
from PIL import Image

from app.api.v1.endpoints import interim_species_scan
from app.main import app


def image_bytes() -> bytes:
    image = Image.new("RGB", (16, 16), color="tan")
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    return buffer.getvalue()


class StubPredictor:
    def predict(self, cross_section: Image.Image, wood_grain: Image.Image) -> dict[str, object]:
        assert cross_section.mode == "RGB"
        assert wood_grain.mode == "RGB"
        return {
            "predicted_species": "mango",
            "species_confidence": 0.91,
            "species_ranking": [
                {"species": "mango", "confidence": 0.91},
                {"species": "gmelina", "confidence": 0.07},
                {"species": "coconut", "confidence": 0.02},
            ],
            "model_profile": "interim_3species_species_only",
        }


def test_interim_species_scan_returns_species_only_response(monkeypatch) -> None:
    monkeypatch.setattr(interim_species_scan, "get_interim_species_predictor", lambda: StubPredictor())
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/interim/species-scan",
            files={
                "cross_section": ("cross.jpg", image_bytes(), "image/jpeg"),
                "wood_grain": ("grain.jpg", image_bytes(), "image/jpeg"),
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["research_status"] == "interim_species_only"
    assert payload["species"]["predicted"] == "mango"
    assert "defects" not in payload
    assert "fprdi" not in payload
    assert payload["modalities_used"] == {"cross_section": True, "wood_grain": True}


def test_interim_species_scan_rejects_non_image_upload(monkeypatch) -> None:
    monkeypatch.setattr(interim_species_scan, "get_interim_species_predictor", lambda: StubPredictor())
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/interim/species-scan",
            files={
                "cross_section": ("cross.txt", b"not an image", "text/plain"),
                "wood_grain": ("grain.jpg", image_bytes(), "image/jpeg"),
            },
        )

    assert response.status_code == 415
