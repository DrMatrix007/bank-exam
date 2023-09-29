import unittest
import requests

ACCOUNT_ID = 1


class TestAccountAPI(unittest.TestCase):
    base_url = "http://localhost:3000/api/account"

    def test_get_account(self):
        # Replace this with a valid account ID
        response = requests.get(f"{self.base_url}?id={ACCOUNT_ID}")
        self.assertEqual(response.status_code, 200)

    def test_update_account_block_status(self):

        # block the user
        payload = {
            "accountId": ACCOUNT_ID,
            "block": True
        }
        response = requests.patch(f"{self.base_url}", json=payload)
        self.assertEqual(response.status_code, 200)

        # check if the user is blocked
        response = requests.get(f"{self.base_url}?id={ACCOUNT_ID}")
        self.assertEqual(response.status_code, 400)

        # unblock the user
        payload["block"] = False

        response = requests.patch(f"{self.base_url}", json=payload)
        self.assertEqual(response.status_code, 200)

        # check if the user is't blocked
        response = requests.get(f"{self.base_url}?id={ACCOUNT_ID}")
        self.assertEqual(response.status_code, 200)
        

class TestTransactionAPI(unittest.TestCase):
    base_url = "http://localhost:3000/api/account/transaction"

    def test_deposit_withdrawal(self):

        payload = {
            "accountId": ACCOUNT_ID,
            "value": 100
        }
        response = requests.post(f"{self.base_url}/deposit", json=payload)
        self.assertEqual(response.status_code, 200)

        response = requests.post(f"{self.base_url}/withdrawal", json=payload)
        self.assertEqual(response.status_code, 200)

    def test_get_transactions(self):

        response = requests.get(f"{self.base_url}?id={ACCOUNT_ID}")
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
