from flask_api import celery , app

class ContextTask(celery.Task):
    def __call__(self, *args, **kwargs):
        with app.app_context():
            return super(ContextTask, self).__call__(*args, **kwargs    )
        
celery.Task = ContextTask