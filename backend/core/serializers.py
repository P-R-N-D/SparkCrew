from rest_framework import serializers


class HealthSerializer(serializers.Serializer):
    status = serializers.CharField()
    service = serializers.CharField()
    backend = serializers.CharField()
    api = serializers.CharField()
