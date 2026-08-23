from scripts.evaluate_species_classifier import classification_metrics


def test_classification_metrics_reports_confusion_matrix_and_per_class_scores() -> None:
    metrics = classification_metrics(
        targets=[0, 0, 1, 1, 2, 2],
        predictions=[0, 1, 1, 1, 2, 0],
        class_names=("coconut", "gmelina", "mango"),
    )

    assert metrics["sample_count"] == 6
    assert metrics["accuracy"] == 4 / 6
    assert metrics["confusion_matrix"] == [[1, 1, 0], [0, 2, 0], [1, 0, 1]]
    assert metrics["per_class"]["gmelina"] == {
        "precision": 2 / 3,
        "recall": 1.0,
        "f1": 0.8,
        "support": 2,
    }


def test_classification_metrics_handles_a_class_without_predictions() -> None:
    metrics = classification_metrics(
        targets=[0, 1], predictions=[0, 0], class_names=("coconut", "gmelina", "mango")
    )

    assert metrics["per_class"]["mango"]["precision"] == 0.0
    assert metrics["per_class"]["mango"]["recall"] == 0.0
    assert metrics["per_class"]["mango"]["f1"] == 0.0
