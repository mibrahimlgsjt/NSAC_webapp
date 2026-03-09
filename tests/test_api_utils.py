import sys
import unittest
from unittest.mock import MagicMock, patch
import os

class TestApiUtils(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Setup mocks in sys.modules to allow importing from blueprints.api
        # without real dependencies. This is done inside the test class to limit scope.
        cls.patcher_flask = patch.dict('sys.modules', {'flask': MagicMock()})
        cls.patcher_flask_login = patch.dict('sys.modules', {'flask_login': MagicMock()})
        cls.patcher_models = patch.dict('sys.modules', {'models': MagicMock()})
        cls.patcher_image_handler = patch.dict('sys.modules', {'utils.image_handler': MagicMock()})
        cls.patcher_extensions = patch.dict('sys.modules', {'extensions': MagicMock()})

        cls.patcher_flask.start()
        cls.patcher_flask_login.start()
        cls.patcher_models.start()
        cls.patcher_image_handler.start()
        cls.patcher_extensions.start()

        # Import after mocking
        if os.getcwd() not in sys.path:
            sys.path.append(os.getcwd())
        from blueprints.api import _get_image_url
        cls._get_image_url = staticmethod(_get_image_url)

    @classmethod
    def tearDownClass(cls):
        cls.patcher_flask.stop()
        cls.patcher_flask_login.stop()
        cls.patcher_models.stop()
        cls.patcher_image_handler.stop()
        cls.patcher_extensions.stop()

    def setUp(self):
        import flask
        # Reset the mock for url_for
        flask.url_for.reset_mock()
        flask.url_for.side_effect = lambda endpoint, filename: f"/static/{filename}"

    def test_get_image_url_none(self):
        self.assertIsNone(self._get_image_url(None))

    def test_get_image_url_empty(self):
        self.assertIsNone(self._get_image_url(""))

    def test_get_image_url_http(self):
        url = "http://example.com/cat.jpg"
        self.assertEqual(self._get_image_url(url), url)

    def test_get_image_url_https(self):
        url = "https://example.com/cat.jpg"
        self.assertEqual(self._get_image_url(url), url)

    def test_get_image_url_filename(self):
        filename = "cat.jpg"
        expected = "/static/cat.jpg"
        result = self._get_image_url(filename)
        self.assertEqual(result, expected)

        import flask
        flask.url_for.assert_called_once_with('static', filename=filename)

if __name__ == '__main__':
    unittest.main()
