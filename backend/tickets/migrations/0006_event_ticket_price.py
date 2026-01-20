# Generated manually

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0005_inquiry'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='ticket_price',
            field=models.DecimalField(decimal_places=2, default=50.00, max_digits=10),
        ),
    ]
