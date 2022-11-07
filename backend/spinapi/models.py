# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Ingredients(models.Model):
    ingredient_name = models.CharField(primary_key=True, max_length=100)
    quantity = models.DecimalField(max_digits=65535, decimal_places=2, blank=True, null=True)
    units = models.CharField(max_length=100, blank=True, null=True)
    ingr_type = models.CharField(max_length=100, blank=True, null=True)
    usage_value = models.DecimalField(max_digits=65535, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ingredients'
        verbose_name_plural = "ingredients"


class Menu(models.Model):
    menu_item = models.CharField(primary_key=True, max_length=100)
    item_type = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=65535, decimal_places=2, blank=True, null=True)
    topping1 = models.CharField(max_length=100, blank=True, null=True)
    topping2 = models.CharField(max_length=100, blank=True, null=True)
    topping3 = models.CharField(max_length=100, blank=True, null=True)
    topping4 = models.CharField(max_length=100, blank=True, null=True)
    sauce = models.CharField(max_length=100, blank=True, null=True)
    drizzle = models.CharField(max_length=100, blank=True, null=True)
    cheese_type = models.CharField(max_length=100, blank=True, null=True)
    default_crust = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'menu'
        verbose_name_plural = "menu items"


class Orders(models.Model):
    order_date = models.DateField(blank=True, null=True)
    price = models.DecimalField(max_digits=65535, decimal_places=2, blank=True, null=True)
    payment_type = models.CharField(max_length=100, blank=True, null=True)
    customer_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orders'
        verbose_name_plural = "Orders"


class Pizzas(models.Model):
    orderid = models.ForeignKey(Orders, models.DO_NOTHING, db_column='orderid', blank=True, null=True)
    pizza_type = models.CharField(max_length=100, blank=True, null=True)
    cheese_type = models.CharField(max_length=100, blank=True, null=True)
    crust = models.CharField(max_length=100, blank=True, null=True)
    sauce = models.CharField(max_length=100, blank=True, null=True)
    drizzle = models.CharField(max_length=100, blank=True, null=True)
    drink = models.CharField(max_length=100, blank=True, null=True)
    topping1 = models.ForeignKey(Ingredients, models.DO_NOTHING, db_column='topping1', blank=True, null=True, related_name='ingredient_name1')
    topping2 = models.ForeignKey(Ingredients, models.DO_NOTHING, db_column='topping2', blank=True, null=True, related_name='ingredient_name2')
    topping3 = models.ForeignKey(Ingredients, models.DO_NOTHING, db_column='topping3', blank=True, null=True, related_name='ingredient_name3')
    topping4 = models.ForeignKey(Ingredients, models.DO_NOTHING, db_column='topping4', blank=True, null=True, related_name='ingredient_name4')
    price = models.DecimalField(max_digits=65535, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pizzas'
        verbose_name_plural = "pizzas"


class Teammembers(models.Model):
    student_name = models.TextField(primary_key=True)
    section = models.IntegerField(blank=True, null=True)
    favorite_movie = models.TextField(blank=True, null=True)
    favorite_holiday = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'teammembers'


class Test(models.Model):
    t = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test'
