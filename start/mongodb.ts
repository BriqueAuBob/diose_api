import mongoose from 'mongoose';
import Env from '@ioc:Adonis/Core/Env';

mongoose.connect(Env.get('MONGODB_URL'));

import 'App/Models/ToolSave';
